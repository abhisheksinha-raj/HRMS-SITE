from sqlalchemy import Column, Integer, String, Date, Enum, UniqueConstraint, DateTime
from sqlalchemy.sql import func
import enum
from database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False, index=True)
    photo_path = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("employee_id", name="uq_employee_id"),
        UniqueConstraint("email", name="uq_email"),
    )


class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    status = Column(Enum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_employee_date"),
    )
