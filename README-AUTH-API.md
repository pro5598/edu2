# Authentication API Documentation

This document describes the authentication API endpoints for the EduVerse platform, supporting three user types: Student, Instructor, and Admin.

## Overview

The authentication system provides role-based access control with the following features:
- Separate registration and login endpoints for each user type
- Password reset functionality
- JWT-based authentication with HTTP-only cookies
- Account activation workflow for instructors
- Admin management of instructor accounts

## User Roles

### Student
- **Registration**: Immediate activation
- **Login**: Direct access to student dashboard
- **Features**: Course enrollment, progress tracking

### Instructor
- **Registration**: Requires admin approval
- **Login**: Only available after admin activation
- **Features**: Course creation, student management

### Admin
- **Registration**: Requires admin code
- **Login**: Full system access
- **Features**: User management, instructor approval

## Authentication Endpoints

### General Authentication

#### POST /api/auth/register
General registration endpoint (legacy, supports role parameter)

#### POST /api/auth/login
General login endpoint (legacy, supports role parameter)

#### GET /api/auth/status
Check authentication status and get user information

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  },
  "dashboardPath": "/student/dashboard"
}
```

#### POST /api/auth/logout
Logout user and clear authentication cookies

### Student Authentication

#### POST /api/auth/student/register
Register a new student account

**Request Body:**
```json
{
  "username": "john_student",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### POST /api/auth/student/login
Login as a student

**Request Body:**
```json
{
  "username": "john_student",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

### Instructor Authentication

#### POST /api/auth/instructor/register
Register a new instructor account (requires admin approval)

**Request Body:**
```json
{
  "username": "jane_instructor",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "bio": "Experienced software developer with 10+ years in web development...",
  "expertise": "JavaScript, React, Node.js",
  "experience": "10+ years",
  "education": "Computer Science Degree",
  "linkedinProfile": "https://linkedin.com/in/janesmith",
  "portfolio": "https://janesmith.dev"
}
```

#### POST /api/auth/instructor/login
Login as an instructor (only if account is activated)

**Request Body:**
```json
{
  "username": "jane_instructor",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

### Admin Authentication

#### POST /api/auth/admin/register
Register a new admin account (requires admin code)

**Request Body:**
```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "Admin",
  "lastName": "User",
  "adminCode": "ADMIN2024"
}
```

#### POST /api/auth/admin/login
Login as an admin

**Request Body:**
```json
{
  "username": "admin_user",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

### Password Reset

#### POST /api/auth/forgot-password
Request password reset token

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password
Reset password using token

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### Admin Management

#### GET /api/admin/instructors
Get list of instructors (admin only)

**Query Parameters:**
- `status`: 'pending', 'active', or omit for all
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### PATCH /api/admin/instructors
Activate or deactivate instructor account (admin only)

**Request Body:**
```json
{
  "instructorId": 123,
  "action": "activate"
}
```

## Password Requirements

All passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Authentication Flow

### Student Registration Flow
1. Student submits registration form
2. Account is immediately activated
3. JWT token is generated and set as cookie
4. User is redirected to student dashboard

### Instructor Registration Flow
1. Instructor submits registration form with additional details
2. Account is created but remains inactive
3. Admin receives notification of pending instructor
4. Admin reviews and activates the account
5. Instructor can then log in

### Admin Registration Flow
1. Admin submits registration form with admin code
2. Admin code is validated
3. Account is immediately activated
4. JWT token is generated and set as cookie
5. User is redirected to admin dashboard

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created (registration)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid credentials)
- `403`: Forbidden (inactive account, invalid admin code)
- `404`: Not Found
- `409`: Conflict (duplicate username/email)
- `500`: Internal Server Error

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens are stored in HTTP-only cookies
- Role-based access control
- Account lockout after failed login attempts
- Password reset tokens expire after 1 hour
- Admin code required for admin registration
- Instructor accounts require manual activation

## Environment Variables

Required environment variables:
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (default: '7d')
- `ADMIN_REGISTRATION_CODE`: Code required for admin registration (default: 'ADMIN2024')
- `NEXT_PUBLIC_BASE_URL`: Base URL for password reset links