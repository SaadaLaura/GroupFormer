from backend.api.dtos.announcement_dto import AnnouncementDTO
from backend.api.dtos.user_dto import UserDTO


class ProjectDTO:
    @staticmethod
    def to_dict(project):
        return {
            'id': project.id_project,
            'name': project.name,
            'description': project.description,
            'size': project.size,
            'missing': project.size - len(project.students),
            'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else None,
            'members': [UserDTO.to_dict(student) for student in project.students],
            'announcements': [AnnouncementDTO.to_dict(announcement) for announcement in project.announcements]
        }