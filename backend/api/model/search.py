from sqlalchemy import Model, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Search(Model):
    __tablename__ = 'search'

    id_skill = Column(Integer, ForeignKey('skill.id_skill'), primary_key=True)
    id_announcement = Column(Integer, ForeignKey('announcement.id_announcement'), primary_key=True)

    announcement = relationship('Announcement', back_populates='search_for')
    skill = relationship('Skill', back_populates='searched_by')