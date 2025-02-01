from backend.api.dtos.skill_dto import SkillDTO
from backend.api.dtos.subject_dto import SubjectDTO


class UserDTO:
    @staticmethod
    def to_dict(user):
        return {
            'id': user.id_user,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'role': user.role.value
        }

    @staticmethod
    def student_to_dict(student):
        return {
            'id': student.id_user,
            'firstname': student.firstname,
            'lastname': student.lastname,
            'email': student.email,
            'project': {
                'id': student.project.id_project,
                'name': student.project.name,
                'description': student.project.description,
                'size': student.project.size,
                'missing': student.project.size - len(student.project.students),
                'members': [UserDTO.to_dict(student) for student in student.project.students],
                'deadline': student.project.deadline.strftime('%Y-%m-%d') if student.project.deadline else None
            },
            'skills': [SkillDTO.to_dict(master.skill) for master in student.masters],
            'subject': [SubjectDTO.to_dict(like.subject) for like in student.likes]
        }