from sqlalchemy import Model, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship


class Announcement(Model):
    __tablename__ = 'announcement'

    id_announcement = Column(Integer, primary_key=True)
    description = Column(String(50), nullable=False)
    publication = Column(Date)
    id_project = Column(Integer, ForeignKey('project.id_project'), nullable=False)

    search_for = relationship('IsAbout', back_populates='announcement')
    is_about = relationship('IsAbout', back_populates='announcement')
