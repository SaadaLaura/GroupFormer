from backend.api.dtos.skill_dto import SkillDTO
from backend.api.dtos.subject_dto import SubjectDTO


class AnnouncementDTO:
    @staticmethod
    def to_dict(announcement):
        return {
            'id': announcement.id_announcement,
            'title': announcement.title,
            'description': announcement.description,
            'publication': announcement.publication.strftime('%Y-%m-%d'),
            'skills': [SkillDTO.to_dict(search.skill) for search in announcement.search_for],
            'subjects': [SubjectDTO.to_dict(about.subject) for about in announcement.is_about],
            'project': {
                'id': announcement.project.id_project,
                'name': announcement.project.name,
                'description': announcement.project.description,
                'size': announcement.project.size,
                'deadline': announcement.project.deadline
            }
        }
