from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.api.database import db


class Announcement(db.Model):
    __tablename__ = 'announcement'

    id_announcement = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(250))
    publication = Column(Date, nullable=False)
    id_project = Column(Integer, ForeignKey('project.id_project'), nullable=False)

    search_for = relationship('Search', back_populates='announcement')
    is_about = relationship('IsAbout', back_populates='announcement')
