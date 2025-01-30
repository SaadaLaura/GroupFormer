from sqlalchemy import Model, Column, String, Integer
from sqlalchemy.orm import relationship


class Subject(Model):
    __tablename__ = 'subject'

    id_subject = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

    liked_by = relationship('Like', back_populates='subject')
    included_by = relationship('IsAbout', back_populates='subject')