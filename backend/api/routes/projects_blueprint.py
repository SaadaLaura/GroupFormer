from datetime import datetime

from flasgger import swag_from
from flask import Blueprint, jsonify, request

from backend.api.database import db
from backend.api.models import Announcement, IsAbout, Search
from backend.api.models.person import Role, Person
from backend.api.models.project import Project
from backend.api.utils.jwt_utils import token_required

projects_bp = Blueprint('projects', __name__)

# POST a project
@projects_bp.route('/add', methods=['POST'])
@token_required(Role.ADMIN.value)
def create_project():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    size = data.get('size')
    deadline = data.get('deadline')  # Format: "YYYY-MM-DD"

    if not name or not size or not description:
        return jsonify({'error': 'Name and size are required'}), 400

    project = Project(
        name=name,
        description=description,
        size=size,
        deadline=datetime.strptime(deadline, "%Y-%m-%d") if deadline else None
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        'message': 'Project created successfully',
        'project': {
            'id': project.id_project,
            'name': project.name,
            'description': project.description,
            'size': project.size,
            'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else None
        }
    }), 201

# Update a project by ID
@projects_bp.route('/<int:id_project>', methods=['PUT'])
@token_required(Role.ADMIN.value)
def update_project(id_project):
    project = Project.query.get(id_project)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    data = request.json
    project.name = data.get('name') if data.get('name') else project.name
    project.deadline = datetime.strptime(data.get('deadline'), "%Y-%m-%d") if data.get('deadline') else project.deadline
    project.description = data.get('description') if data.get('description') else project.description
    project.size = data.get('size') if data.get('size') else project.size

    db.session.commit()

    return jsonify({'message': 'Project updated successfully'}), 200

# DELETE a project by ID
@projects_bp.route('/<int:id_project>', methods=['DELETE'])
@token_required(Role.ADMIN.value)
def delete_project(id_project):
    project = Project.query.get(id_project)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    for announcement in project.announcements:
        db.session.query(IsAbout).filter_by(id_announcement=announcement.id_announcement).delete()
        db.session.query(Search).filter_by(id_announcement=announcement.id_announcement).delete()

    db.session.query(Announcement).filter_by(id_project=id_project).delete()
    db.session.query(Person).filter_by(id_project=id_project).update({"id_project": None})

    db.session.delete(project)
    db.session.commit()

    return jsonify({'message': 'Project deleted successfully'}), 200

# GET all projects
@projects_bp.route('', methods=['GET'])
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