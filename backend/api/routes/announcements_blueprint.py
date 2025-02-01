from datetime import datetime

from flasgger import swag_from
from flask import Blueprint, jsonify, request

from backend.api.database import db
from backend.api.dtos.announcement_dto import AnnouncementDTO
from backend.api.dtos.skill_dto import SkillDTO
from backend.api.dtos.subject_dto import SubjectDTO
from backend.api.models import Announcement, Search, Subject, Skill, IsAbout, Project
from backend.api.models.person import Role
from backend.api.utils.jwt_utils import token_required

announcements_bp = Blueprint('announcements', __name__)


# POST an announcement
@announcements_bp.route('/add', methods=['POST'])
@token_required()
def create_announcement():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    id_project = data.get('id_project')

    if not title or not id_project:
        return jsonify({'error': 'Title and project ID are required'}), 400

    project = Project.query.get(id_project)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    announcement = Announcement(
        title=title,
        description=description,
        publication=datetime.now(),
        id_project=id_project
    )

    db.session.add(announcement)
    db.session.commit()

    if 'skills' in data:
        for skill_id in data.get('skills'):
            skill = Skill.query.get(skill_id)
            if skill:
                db.session.add(Search(id_skill=skill.id_skill, id_announcement=announcement.id_announcement))
            else:
                return jsonify({'error': f'Skill ID {skill_id} not found'}), 400

    if 'subjects' in data:
        for subject_id in data.get('subjects'):
            subject = Subject.query.get(subject_id)
            if subject:
                db.session.add(IsAbout(id_subject=subject.id_subject, id_announcement=announcement.id_announcement))
            else:
                return jsonify({'error': f'Subject ID {subject_id} not found'}), 400

    db.session.commit()

    return jsonify({
        'message': 'Announcement created successfully',
        'announcement': AnnouncementDTO.to_dict(announcement)
    }), 201


# Update an announcement by ID
@announcements_bp.route('/<int:id_announcement>', methods=['PUT'])
@token_required(Role.ADMIN.value)
def update_announcement(id_announcement):
    announcement = Announcement.query.get(id_announcement)

    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404

    data = request.json
    announcement.title = data.get('title') if data.get('title') else announcement.title
    announcement.description = data.get('description') if data.get('description') else announcement.description

    # Replace skills
    if 'skills' in data:
        Search.query.filter_by(id_announcement=id_announcement).delete()

        for skill_id in data.get('skills'):
            skill = Skill.query.get(skill_id)
            if not skill:
                return jsonify({'error': f'Skill ID {skill_id} not found'}), 400
            db.session.add(Search(id_skill=skill.id_skill, id_announcement=id_announcement))

    # Replace subjects
    if 'subjects' in data:
        IsAbout.query.filter_by(id_announcement=id_announcement).delete()

        for subject_id in data.get('subjects'):
            subject = Subject.query.get(subject_id)
            if not subject:
                return jsonify({'error': f'Subject ID {subject_id} not found'}), 400
            db.session.add(IsAbout(id_subject=subject.id_subject, id_announcement=id_announcement))

    db.session.commit()

    return jsonify({'message': 'Announcement updated successfully'}), 200


# DELETE an announcement by ID
@announcements_bp.route('/<int:id_announcement>', methods=['DELETE'])
@token_required(Role.ADMIN.value)
def delete_announcement(id_announcement):
    announcement = Announcement.query.get(id_announcement)

    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404

    db.session.query(IsAbout).filter_by(id_announcement=announcement.id_announcement).delete()
    db.session.query(Search).filter_by(id_announcement=announcement.id_announcement).delete()

    db.session.delete(announcement)
    db.session.commit()

    return jsonify({'message': 'Announcement deleted successfully'}), 200


# GET all announcements
@announcements_bp.route('', methods=['GET'])
@swag_from('swagger/announcements/announcements.yaml')
def get_all_announcements():
    announcements = Announcement.query.all()
    return jsonify([
        AnnouncementDTO.to_dict(announcement) for announcement in announcements
    ]), 200


# GET an announcement by ID
@announcements_bp.route('/<int:announcement_id>', methods=['GET'])
@swag_from('swagger/announcements/announcements_by_id.yaml')
def get_announcement(announcement_id):
    announcement = Announcement.query.get(announcement_id)
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    return jsonify(AnnouncementDTO.to_dict(announcement)), 200


# GET skills searched by an announcement
@announcements_bp.route('/<int:announcement_id>/research', methods=['GET'])
@swag_from('swagger/announcements/announcements_research.yaml')
def get_announcement_search(announcement_id):
    skills = db.session.query(Skill).join(Search).filter(Search.id_announcement == announcement_id).all()
    return jsonify([
        SkillDTO.to_dict(skill) for skill in skills
    ]), 200


# GET subjects included by an announcement
@announcements_bp.route('/<int:announcement_id>/about', methods=['GET'])
@swag_from('swagger/announcements/announcements_about.yaml')
def get_announcement_about(announcement_id):
    subjects = db.session.query(Subject).join(IsAbout).filter(IsAbout.id_announcement == announcement_id).all()
    return jsonify([
        SubjectDTO.to_dict(subject) for subject in subjects
    ]), 200
