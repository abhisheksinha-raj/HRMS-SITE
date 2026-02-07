# HRMS Lite - Human Resource Management System

A production-ready, lightweight HRMS application built with modern web technologies. Manage employees and track attendance with a clean, professional interface.

## 📋 Overview

HRMS Lite is a comprehensive yet lightweight human resource management solution that provides essential features for employee management and attendance tracking. It follows production-ready patterns with proper validation, error handling, and deployment considerations.

**Key Features:**
- ✅ Employee Management (Add, List, Delete)
- ✅ Attendance Tracking (Mark, View per Employee)
- ✅ Server-side Validation & Error Handling
- ✅ Professional, Responsive UI
- ✅ Production-ready Architecture
- ✅ CORS Enabled
- ✅ Database Flexibility (SQLite for Dev, PostgreSQL for Prod)

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI 0.104+ (Python)
- **ORM:** SQLAlchemy 2.0+
- **Database:** PostgreSQL (Production), SQLite (Development)
- **Validation:** Pydantic 2.0+
- **Server:** Uvicorn
- **API Standard:** REST with proper HTTP status codes

### Frontend
- **Library:** React 18.2+
- **Build Tool:** Vite 5.0+
- **Styling:** Tailwind CSS 3.3+
- **HTTP Client:** Axios 1.6+
- **Runtime:** Node 18+

### Deployment
- **Backend:** Render, Railway, Heroku, AWS Elastic Beanstalk
- **Frontend:** Vercel, Netlify, CloudFlare Pages
- **Database:** PostgreSQL (Render, AWS RDS, Neon)

## 📁 Project Structure

```
HRMS SITE/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration & session management
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic validation schemas
│   ├── crud.py                 # Database operations
│   ├── routers/
│   │   ├── employees.py        # Employee endpoints
│   │   └── attendance.py       # Attendance endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variables template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx      # Employee add form
│   │   │   ├── EmployeeTable.jsx     # Employee list display
│   │   │   ├── AttendanceForm.jsx    # Attendance marking form
│   │   │   └── AttendanceTable.jsx   # Attendance records display
│   │   ├── pages/
│   │   │   ├── Employees.jsx         # Employee management page
│   │   │   └── Attendance.jsx        # Attendance management page
│   │   ├── services/
│   │   │   └── api.js                # Axios API configuration & calls
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── index.html               # HTML template
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   └── dist/                    # Build output (generated)
│
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- **Backend:** Python 3.9+, pip
- **Frontend:** Node.js 18+, npm/yarn
- **Database:** PostgreSQL (optional, SQLite works for dev)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment (optional for development):**
   ```bash
   cp .env.example .env
   # Edit .env for database configuration
   # Default uses SQLite (hrms.db)
   ```

5. **Run the server:**
   ```bash
   python main.py
   ```
   - API runs on `http://localhost:8000`
   - API docs available at `http://localhost:8000/docs`
   - ReDoc available at `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Default: VITE_API_URL=http://localhost:8000
   # Change as needed
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   - Application runs on `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```
   - Output in `dist/` folder

## 📚 API Documentation

### Employees Endpoints

#### Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```
**Response:** `201 Created`
```json
{
  "id": 1,
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering",
  "created_at": "2024-02-06T10:30:00",
  "updated_at": "2024-02-06T10:30:00"
}
```

#### List Employees
```http
GET /api/employees?skip=0&limit=100
```
**Response:** `200 OK` - Array of employees

#### Get Employee
```http
GET /api/employees/{employee_id}
```
**Response:** `200 OK` - Employee object

#### Delete Employee
```http
DELETE /api/employees/{employee_id}
```
**Response:** `204 No Content`

### Attendance Endpoints

#### Mark Attendance
```http
POST /api/attendance
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2024-02-06",
  "status": "Present"
}
```
**Status values:** `"Present"` or `"Absent"`
**Response:** `201 Created` (or updated if exists)

#### Get Employee Attendance
```http
GET /api/attendance/employee/{employee_id}?start_date=2024-02-01&end_date=2024-02-06
```
**Response:** `200 OK` - Array of attendance records

#### List All Attendance
```http
GET /api/attendance?skip=0&limit=100
```
**Response:** `200 OK` - Array of all records

### Error Handling

All endpoints return meaningful error messages:

```json
{
  "detail": "Employee ID 'EMP001' already exists"
}
```

**Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid input or duplicate
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 🗄 Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  employee_id VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  department VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY,
  employee_id VARCHAR NOT NULL,
  date DATE NOT NULL,
  status VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  UNIQUE(employee_id, date)
);
```

## 🔒 Security Features

- ✅ Input validation with Pydantic
- ✅ Email format validation
- ✅ Unique constraints on critical fields
- ✅ CORS properly configured
- ✅ No sensitive data in responses
- ✅ Proper HTTP status codes

## 📝 Validation Rules

### Employee
- **employee_id:** Required, unique, max 50 characters
- **full_name:** Required, max 100 characters
- **email:** Required, valid email format, unique
- **department:** Required, max 100 characters

### Attendance
- **employee_id:** Required, must exist in employees table
- **date:** Required, valid date format
- **status:** Required, must be "Present" or "Absent"
- **Constraint:** One record per employee per date (auto-update if exists)

## 🚀 Deployment

### Backend Deployment on Render

1. **Create PostgreSQL database on Render**
   - Copy the database URL

2. **Create Web Service**
   - Repository: Your GitHub repo
   - Environment: Python 3.9
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`

3. **Set Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy** - Render automatically deploys on push

### Frontend Deployment on Vercel

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy using Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com
   ```

4. **Connect GitHub** - Auto-deploys on push

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@host:port/hrms
FRONTEND_URL=https://frontend-domain.vercel.app
```

**Frontend (.env):**
```
VITE_API_URL=https://backend-domain.onrender.com
```

## ✨ Features & Assumptions

### Implemented Features
- ✅ Full CRUD for employees
- ✅ Attendance marking with auto-update
- ✅ Server-side validation
- ✅ Unique constraints (Employee ID, Email, Employee+Date)
- ✅ Cascade delete (delete employee → delete related attendance)
- ✅ Responsive design
- ✅ Loading/Empty/Error states
- ✅ Professional UI/UX

### Assumptions
1. **Single Organization:** No multi-tenant support (not needed for Lite version)
2. **Simple Attendance:** Only Present/Absent (no leave types)
3. **No Authentication:** Can be added later with JWT
4. **SQLite Dev, PostgreSQL Prod:** Automatic connection handling
5. **Daily Attendance:** Only one record per employee per date
6. **Timezone:** Uses server timezone (can be enhanced)
7. **Pagination:** Default limit 100 records

## 📦 Maintenance & Scaling

### Adding Features
1. **New Model:** Add to `models.py`
2. **New Schema:** Add to `schemas.py`
3. **New CRUD:** Add to `crud.py`
4. **New Router:** Create file in `routers/`
5. **Include Router:** Add to `main.py`

### Performance Optimization
- Add database indexes (already optimized)
- Implement pagination (already done)
- Add caching for employee list
- Consider read replicas for large scale

### Monitoring
- Add logging to CRUD operations
- Monitor API response times
- Track database query performance
- Set up alerts for 500 errors

## 🧪 Testing (Recommended)

### Backend Testing
```bash
pip install pytest pytest-asyncio
pytest
```

### Frontend Testing
```bash
npm install -D vitest @testing-library/react
npm run test
```

## 📞 Troubleshooting

### Backend Issues
- **Port 8000 in use:** Change port in `main.py` or stop other service
- **Database connection error:** Check `DATABASE_URL` in `.env`
- **CORS errors:** Verify `FRONTEND_URL` matches frontend domain

### Frontend Issues
- **API 404 errors:** Verify `VITE_API_URL` points to correct backend
- **Port 5173 in use:** Change port in `vite.config.js`
- **Module not found:** Run `npm install` again

## 📄 License

MIT License - Feel free to use this project as template or reference.

## 👨‍💻 Development Notes

### Code Quality
- Clean, modular architecture
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Meaningful variable/function names
- No over-engineering

### Best Practices Implemented
- Separation of concerns
- Dependency injection
- Error handling at all levels
- Input validation
- Secure database operations
- CORS configuration
- Environment variable management
- Production-ready structure

---

**Version:** 1.0.0  
**Last Updated:** February 6, 2026  
**Author:** Abhishek raj

