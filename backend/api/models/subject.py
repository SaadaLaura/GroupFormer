from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from backend.api.database import db


class Subject(db.Model):
    __tablename__ = 'subject'

    id_subject = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)

    liked_by = relationship('Like', back_populates='subject')
    included_by = relationship('IsAbout', back_populates='subject')