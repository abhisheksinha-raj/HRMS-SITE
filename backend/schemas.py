from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import date, datetime
from enum import Enum


class AttendanceStatusEnum(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)
    photo_path: Optional[str] = None

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v):
        if not v.strip():
            raise ValueError("employee_id cannot be empty")
        return v.strip()

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v):
        if not v.strip():
            raise ValueError("full_name cannot be empty")
        return v.strip()

    @field_validator("department")
    @classmethod
    def validate_department(cls, v):
        if not v.strip():
            raise ValueError("department cannot be empty")
        return v.strip()


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = Field(None, min_length=1, max_length=100)


class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AttendanceBase(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: date
    status: AttendanceStatusEnum

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v):
        if not v.strip():
            raise ValueError("employee_id cannot be empty")
        return v.strip()

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if not v:
            raise ValueError("date is required")
        return v


class AttendanceCreate(AttendanceBase):
    pass


class Attendance(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ErrorDetail(BaseModel):
    detail: str
