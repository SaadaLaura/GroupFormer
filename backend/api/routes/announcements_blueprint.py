from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.database import db
from backend.api.models import Announcement, Search, Subject, Skill, IsAbout

announcements_bp = Blueprint('announcements', __name__)

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