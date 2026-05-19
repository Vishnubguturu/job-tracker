import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    location = Column(String, default="")
    pay = Column(String, default="")
    status = Column(String, default="Waiting")
    next_stage = Column(String, default="N/A")
    email = Column(String, default="")
    referred = Column(Boolean, default=False)
    date_applied = Column(String, nullable=False)
    notes = Column(String, default="")
