from sqlalchemy import Model, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Master(Model):
    __tablename__ = 'master'

    id_user = Column(Integer, ForeignKey('person.id_user'), primary_key=True)
    id_skill = Column(Integer, ForeignKey('skill.id_skill'), primary_key=True)

    person = relationship('Person', back_populates='masters')
    skill = relationship('Skill', back_populates='mastered_by')