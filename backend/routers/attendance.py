from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas import Attendance, AttendanceCreate, ErrorDetail
from datetime import date
import crud

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.post(
    "/",
    response_model=Attendance,
    responses={
        200: {"description": "Attendance updated"},
        201: {"description": "Attendance created"},
        400: {"model": ErrorDetail, "description": "Invalid input"},
        404: {"model": ErrorDetail, "description": "Employee not found"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark or update attendance for an employee. Returns 201 for new, 200 for update."""
    try:
        # Verify employee exists
        employee = crud.get_employee(db, attendance.employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{attendance.employee_id}' not found",
            )

        record, is_update = crud.mark_attendance(db, attendance)
        return record

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark attendance",
        )


@router.get(
    "/employee/{employee_id}",
    response_model=list[Attendance],
    responses={
        404: {"model": ErrorDetail, "description": "Employee not found"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def get_employee_attendance(
    employee_id: str,
    start_date: date = Query(None),
    end_date: date = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Get attendance records for a specific employee"""
    try:
        # Verify employee exists
        employee = crud.get_employee(db, employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found",
            )

        return crud.get_attendance_by_employee(
            db, employee_id, start_date, end_date, skip, limit
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch attendance records",
        )


@router.get(
    "/",
    response_model=list[Attendance],
    responses={
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def list_attendance(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """List all attendance records"""
    try:
        return crud.list_attendance(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch attendance records",
        )
