class SubjectDTO:
    @staticmethod
    def to_dict(subject):
        return {
            'id': subject.id_subject,
            'name': subject.name
        }