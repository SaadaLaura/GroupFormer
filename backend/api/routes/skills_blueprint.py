from flask import Blueprint, jsonify, request

from backend.api.database import db
from backend.api.dtos.skill_dto import SkillDTO
from backend.api.models import Skill
from backend.api.models.person import Role
from backend.api.utils.jwt_utils import token_required

skills_bp = Blueprint('skills', __name__)


# GET all skills
@skills_bp.route('', methods=['GET'])
@token_required
def get_all_skills():
    skills = Skill.query.all()
    return jsonify([
        SkillDTO.to_dict(skill) for skill in skills
    ]), 200


# POST a skill
@skills_bp.route('', methods=['POST'])
@token_required(Role.ADMIN.value)
def add_skill():
    skill = Skill(request.json.get('name'))
    db.session.add(skill)
    db.session.commit()

    return jsonify({
        'message': 'Skill added successfully'
    }), 201


# DELETE a skill
@skills_bp.route('/<int:id_skill>', methods=['DELETE'])
@token_required(Role.ADMIN.value)
def delete_skill(id_skill):
    skill = Skill.query.get(id_skill)

    if not skill:
        return jsonify({'error': 'Skill not found'}), 404

    db.session.delete(skill)
    db.session.commit()

    return jsonify({'message': 'Skill deleted successfully'}), 200
