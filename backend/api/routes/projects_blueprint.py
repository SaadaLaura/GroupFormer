from datetime import datetime

from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.models import Announcement
from backend.api.models.project import Project

projects_bp = Blueprint('projects', __name__)

# GET all projects
@projects_bp.route('', methods=['GET'])
@swag_from('swagger/projects/projects.yaml')
def get_all_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': project.id_project,
        'name': project.name,
        'description': project.description,
        'size': project.size,
        'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else None
    } for project in projects]), 200

# GET a project by ID
@projects_bp.route('/<int:project_id>', methods=['GET'])
@swag_from('swagger/projects/projects_by_id.yaml')
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({
        'id': project.id_project,
        'name': project.name,
        'description': project.description,
        'size': project.size,
        'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else None
    }), 200

# GET project announcements
@projects_bp.route('/<int:project_id>/announcements', methods=['GET'])
@swag_from('swagger/projects/projects_announcements.yaml')
def get_project_announcements(project_id):
    announcements = Announcement.query.filter_by(id_project=project_id).all()
    return jsonify([{
        'id': announcement.id_announcement,
        'title': announcement.title,
        'description': announcement.description,
        'publication': announcement.publication.strftime('%Y-%m-%d') if announcement.publication else None
    } for announcement in announcements]), 200