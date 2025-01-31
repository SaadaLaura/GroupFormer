from datetime import datetime

from flasgger import swag_from
from flask import Blueprint, jsonify, request

from backend.api.database import db
from backend.api.models import Announcement, Search, Subject, Skill, IsAbout, Project
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

    return jsonify({
        'message': 'Announcement created successfully',
        'announcement': {
            'id': announcement.id_announcement,
            'title': announcement.title,
            'description': announcement.description,
            'publication': announcement.publication.strftime('%Y-%m-%d'),
            'id_project': announcement.id_project
        }
    }), 201

# GET all announcements
@announcements_bp.route('', methods=['GET'])
@swag_from('swagger/announcements/announcements.yaml')
def get_all_announcements():
    announcements = Announcement.query.all()
    return jsonify([{
        'id': announcement.id_announcement,
        'title': announcement.title,
        'description': announcement.description,
        'publication': announcement.publication,
        'id_project': announcement.id_project
    } for announcement in announcements]), 200

# GET an announcement by ID
@announcements_bp.route('/<int:announcement_id>', methods=['GET'])
@swag_from('swagger/announcements/announcements_by_id.yaml')
def get_announcement(announcement_id):
    announcement = Announcement.query.get(announcement_id)
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    return jsonify({
        'id': announcement.id_announcement,
        'title': announcement.title,
        'description': announcement.description,
        'publication': announcement.publication,
        'id_project': announcement.id_project
    }), 200

# GET skills searched by an announcement
@announcements_bp.route('/<int:announcement_id>/research', methods=['GET'])
@swag_from('swagger/announcements/announcements_research.yaml')
def get_announcement_search(announcement_id):
    skills = db.session.query(Skill).join(Search).filter(Search.id_announcement == announcement_id).all()
    return jsonify([{
        'id': skill.id_skill,
        'name': skill.name
    } for skill in skills]), 200

# GET subjects included by an announcement
@announcements_bp.route('/<int:announcement_id>/about', methods=['GET'])
@swag_from('swagger/announcements/announcements_about.yaml')
def get_announcement_about(announcement_id):
    subjects = db.session.query(Subject).join(IsAbout).filter(IsAbout.id_announcement == announcement_id).all()
    return jsonify([{
        'id': subject.id_subject,
        'name': subject.name
    } for subject in subjects]), 200