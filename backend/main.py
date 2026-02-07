from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from database import engine, Base
from routers import employees, attendance, dashboard

load_dotenv()

# Create upload directory
UPLOAD_DIR = "uploads/photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System API",
    version="1.0.0",
)

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:5177",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check
@app.get(
    "/api/health",
    tags=["health"],
    summary="Health Check",
    responses={200: {"description": "API is healthy"}},
)
def health_check():
    """Check if the API is running"""
    return {"status": "healthy", "version": "1.0.0"}


# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

# Mount static files for photo uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/", tags=["root"])
def read_root():
    """API root endpoint"""
    return {
        "message": "Welcome to HRMS Lite API",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
