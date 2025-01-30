from sqlalchemy import Model, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Like(Model):
    __tablename__ = 'like'

    id_user = Column(Integer, ForeignKey('person.id_user'), primary_key=True)
    id_subject = Column(Integer, ForeignKey('subject.id_subject'), primary_key=True)

    person = relationship('Person', back_populates='likes')
    subject = relationship('Subject', back_populates='liked_by')