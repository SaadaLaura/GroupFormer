from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship

from backend.api.database import db


class Project(db.Model):
    __tablename__ = 'project'

    id_project = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    deadline = Column(Date)
    description = Column(String(50))
    size = Column(Integer)

    students = relationship('Person', back_populates='project')
