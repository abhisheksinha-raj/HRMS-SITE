from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models import Employee, Attendance, AttendanceStatus
from schemas import EmployeeCreate, EmployeeUpdate, AttendanceCreate
from datetime import date


# Employee CRUD Operations
def create_employee(db: Session, employee: EmployeeCreate):
    """Create a new employee"""
    db_employee = Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
        photo_path=getattr(employee, "photo_path", None),
    )
    try:
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        error_str = str(e).lower()
        if "employee_id" in error_str or "uq_employee_id" in error_str:
            raise ValueError(f"Employee ID '{employee.employee_id}' already exists")
        elif "email" in error_str or "uq_email" in error_str:
            raise ValueError(f"Email '{employee.email}' already exists")
        else:
            raise ValueError("Duplicate entry or constraint violation. Please check your input.")
    except Exception as e:
        db.rollback()
        raise


def get_employee(db: Session, employee_id: str):
    """Get a specific employee by employee_id"""
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str):
    """Get a specific employee by email"""
    return db.query(Employee).filter(Employee.email == email).first()


def list_employees(db: Session, skip: int = 0, limit: int = 100):
    """List all employees with pagination"""
    return db.query(Employee).offset(skip).limit(limit).all()


def delete_employee(db: Session, employee_id: str):
    """Delete an employee"""
    employee = get_employee(db, employee_id)
    if not employee:
        return None
    
    # Also delete related attendance records
    db.query(Attendance).filter(Attendance.employee_id == employee_id).delete()
    
    db.delete(employee)
    db.commit()
    return employee


# Attendance CRUD Operations
def mark_attendance(db: Session, attendance: AttendanceCreate):
    """Mark or update attendance for an employee on a specific date"""
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()

    if existing:
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing, True  # True indicates update

    db_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance, False  # False indicates create


def get_attendance(db: Session, attendance_id: int):
    """Get a specific attendance record"""
    return db.query(Attendance).filter(Attendance.id == attendance_id).first()


def get_attendance_by_employee(
    db: Session,
    employee_id: str,
    start_date: date = None,
    end_date: date = None,
    skip: int = 0,
    limit: int = 100
):
    """Get attendance records for a specific employee, optionally filtered by date range"""
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    return query.order_by(Attendance.date.desc()).offset(skip).limit(limit).all()


def list_attendance(db: Session, skip: int = 0, limit: int = 100):
    """List all attendance records"""
    return db.query(Attendance).order_by(Attendance.date.desc()).offset(skip).limit(limit).all()
