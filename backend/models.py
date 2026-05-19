import uuid
from sqlalchemy import Column, String, Boolean, Date
from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
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
