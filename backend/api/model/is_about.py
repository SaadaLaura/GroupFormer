from sqlalchemy import Model, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class IsAbout(Model):
    __tablename__ = 'is_about'

    id_announcement = Column(Integer, ForeignKey('announcement.id_announcement'), primary_key=True)
    id_subject = Column(Integer, ForeignKey('subject.id_subject'), primary_key=True)

    announcement = relationship('Announcement', back_populates='is_about')
    subject = relationship('Subject', back_populates='included_by')