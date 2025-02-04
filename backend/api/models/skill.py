from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.api.database import db


class Skill(db.Model):
    __tablename__ = 'skill'

    id_skill = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)

    mastered_by = relationship('Master', back_populates='skill')
    searched_by = relationship('Search', back_populates='skill')