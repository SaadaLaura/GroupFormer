class SkillDTO:
    @staticmethod
    def to_dict(skill):
        return {
            'id': skill.id_skill,
            'name': skill.name
        }