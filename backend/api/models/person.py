import enum

import bcrypt
from sqlalchemy import Column, Integer, String, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from backend.api.database import db


class Role(enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"


class Person(db.Model):
    __tablename__ = 'person'

    id_user = Column(Integer, primary_key=True, autoincrement=True)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    password = Column(String(250), nullable=False)
    role = Column(Enum(Role), nullable=False)
    first_connection = Column(Boolean, nullable=False)
    id_project = Column(Integer, ForeignKey('project.id_project'))

    project = relationship('Project', back_populates='students')
    masters = relationship('Master', back_populates='student')
    likes = relationship('Like', back_populates='student')

    def set_password(self, password):
        """ Hash and set password """
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """ Verify password """
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))
