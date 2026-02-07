from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from database import get_db
from models import Employee, Attendance, AttendanceStatus

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics: total employees and today's attendance"""
    try:
        # Get total employees
        total_employees = db.query(func.count(Employee.id)).scalar() or 0
        
        # Get today's attendance statistics
        today = date.today()
        
        present_today = (
            db.query(func.count(Attendance.id))
            .filter(
                Attendance.date == today,
                Attendance.status == AttendanceStatus.PRESENT
            )
            .scalar() or 0
        )
        
        absent_today = (
            db.query(func.count(Attendance.id))
            .filter(
                Attendance.date == today,
                Attendance.status == AttendanceStatus.ABSENT
            )
            .scalar() or 0
        )
        
        return {
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": absent_today,
        }
    except Exception as e:
        print(f"ERROR in get_dashboard_stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard stats: {str(e)}",
        )
