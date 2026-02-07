from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import get_db
from schemas import Employee, EmployeeCreate, ErrorDetail
import crud
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/api/employees", tags=["employees"])

UPLOAD_DIR = "uploads/photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/",
    response_model=Employee,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorDetail, "description": "Invalid input or duplicate employee"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def create_employee(
    employee_id: str = Form(...),
    full_name: str = Form(...),
    email: str = Form(...),
    department: str = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    """Create a new employee with optional photo upload"""
    photo_path = None
    filename = None
    
    try:
        # Validate photo first but don't save yet
        if photo:
            if not photo.content_type.startswith("image/"):
                raise ValueError("Uploaded file must be an image")
            if photo.size and photo.size > 5 * 1024 * 1024:
                raise ValueError("Photo size must be less than 5MB")
        
        # Try to insert employee first (before saving file)
        employee_data = EmployeeCreate(
            employee_id=employee_id,
            full_name=full_name,
            email=email,
            department=department,
            photo_path=None,  # Will update after file is saved
        )
        employee = crud.create_employee(db, employee_data)
        
        # Now save photo file if provided
        if photo:
            try:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
                filename = timestamp + photo.filename
                filepath = os.path.join(UPLOAD_DIR, filename)
                
                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(photo.file, buffer)
                
                photo_path = f"uploads/photos/{filename}"
                employee.photo_path = photo_path
                db.commit()
                db.refresh(employee)
            except Exception as file_err:
                print(f"ERROR saving photo: {file_err}")
                # Photo save failed, but employee was created without photo
                # This is acceptable - employee exists, just without photo
                db.rollback()
        
        return employee
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        import traceback
        print(f"ERROR creating employee: {type(e).__name__}: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create employee: {str(e)}",
        )


@router.post(
    "/json",
    response_model=Employee,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorDetail, "description": "Invalid input or duplicate employee"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def create_employee_json(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee via JSON (no file upload)."""
    try:
        return crud.create_employee(db, employee)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create employee")


@router.get(
    "/",
    response_model=list[Employee],
    responses={
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def list_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """List all employees"""
    try:
        return crud.list_employees(db, skip=skip, limit=limit)
    except Exception as e:
        import traceback
        print(f"ERROR in list_employees: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch employees: {str(e)}",
        )


@router.get(
    "/{employee_id}",
    response_model=Employee,
    responses={
        404: {"model": ErrorDetail, "description": "Employee not found"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Get a specific employee by employee_id"""
    try:
        employee = crud.get_employee(db, employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found",
            )
        return employee
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employee",
        )


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        404: {"model": ErrorDetail, "description": "Employee not found"},
        500: {"model": ErrorDetail, "description": "Server error"},
    },
)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete an employee"""
    try:
        employee = crud.delete_employee(db, employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete employee",
        )
