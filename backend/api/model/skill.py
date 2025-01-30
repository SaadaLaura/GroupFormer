from sqlalchemy import Model, Column, Integer, String
from sqlalchemy.orm import relationship


class Skill(Model):
    __tablename__ = 'skill'

    id_skill = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

    mastered_by = relationship('Master', back_populates='skill')
    searched_by = relationship('Search', back_populates='skill')