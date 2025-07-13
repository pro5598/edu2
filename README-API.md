# EduVerse - Online Course Platform API

A complete backend API system for an online course selling platform built with Next.js, Sequelize, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **User Roles**: Student, Instructor, and Admin with different permissions
- **Course Management**: Create, read, update, and delete courses
- **Enrollment System**: Students can purchase and enroll in courses
- **Shopping Cart**: Add/remove courses to/from cart
- **Wishlist**: Save courses for later
- **Reviews & Ratings**: Course feedback system
- **Admin Dashboard**: Analytics and user management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcryptjs
- **API Style**: RESTful API routes

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Database Setup

Make sure PostgreSQL is running and create a database named `edu`:

```sql
CREATE DATABASE edu;
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

The `.env.local` file is already configured with your database credentials.

### 4. Initialize Database

Run the database initialization script to create tables and seed data:

```bash
bun run init-db
```

This will create:
- Database tables
- Default admin user (username: `admin`, password: `admin123`)
- Sample instructor (username: `instructor1`, password: `instructor123`)
- Sample student (username: `student1`, password: `student123`)
- Sample courses

### 5. Start Development Server

```bash
bun run dev
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |
| GET | `/api/auth/me` | Get current user | Authenticated |

### Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses` | Get all published courses | Public |
| POST | `/api/courses` | Create new course | Instructor |
| GET | `/api/courses/[id]` | Get course details | Public |
| PUT | `/api/courses/[id]` | Update course | Instructor/Admin |
| DELETE | `/api/courses/[id]` | Delete course | Instructor/Admin |
| GET | `/api/instructor/courses` | Get instructor's courses | Instructor |

### Shopping Cart

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user's cart | Student |
| POST | `/api/cart` | Add course to cart | Student |
| DELETE | `/api/cart/[id]` | Remove item from cart | Student |

### Wishlist

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/wishlist` | Get user's wishlist | Student |
| POST | `/api/wishlist` | Toggle course in wishlist | Student |

### Enrollments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/enrollments` | Get user's enrollments | Student |
| POST | `/api/enrollments` | Purchase courses | Student |

### Reviews

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reviews` | Get course reviews | Public |
| POST | `/api/reviews` | Create course review | Student |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/analytics` | Get platform analytics | Admin |

## API Usage Examples

### Login

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'student1',
    password: 'student123',
    role: 'student' // optional
  })
});

const data = await response.json();
```

### Get Courses

```javascript
const response = await fetch('/api/courses?category=web-development&search=react&page=1&limit=12');
const data = await response.json();
```

### Add to Cart

```javascript
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    courseId: 1
  })
});
```

### Purchase Courses

```javascript
const response = await fetch('/api/enrollments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    courseIds: [1, 2, 3],
    paymentMethod: 'card'
  })
});
```

## Database Models

### User
- id, username, email, password, firstName, lastName
- role (student, instructor, admin)
- profileImage, bio, isActive

### Course
- id, title, description, category, level, price
- thumbnail, duration, totalLessons, requirements, objectives
- instructorId, averageRating, totalReviews, totalStudents
- isPublished

### Lesson
- id, title, description, videoUrl, duration, order
- courseId, chapterTitle, isPreview

### Enrollment
- id, studentId, courseId, enrollmentDate
- progress, completedLessons, isCompleted, paidAmount

### Review
- id, studentId, courseId, rating, comment, isApproved

### Cart
- id, studentId, courseId, addedAt

### Wishlist
- id, studentId, courseId, addedAt

## Authentication Flow

1. User logs in with username/email and password
2. Server validates credentials and generates JWT token
3. Token is stored in HTTP-only cookie
4. Subsequent requests include the cookie for authentication
5. Middleware validates token and attaches user to request

## Role-Based Access Control

- **Student**: Can browse courses, purchase, review, manage cart/wishlist
- **Instructor**: Can create and manage their own courses
- **Admin**: Full access to all resources and analytics

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT tokens with expiration
- HTTP-only cookies
- Role-based access control
- Input validation
- SQL injection prevention (Sequelize ORM)

## Development Notes

- All API routes are in the `src/app/api/` directory
- Database models are in `src/models/`
- Authentication middleware is in `src/middleware/auth.js`
- Database configuration is in `src/lib/database.js`
- JWT utilities are in `src/lib/jwt.js`

## Next Steps

1. Install the required dependencies: `bun install`
2. Set up your PostgreSQL database
3. Run the database initialization: `bun run init-db`
4. Start the development server: `bun run dev`
5. Test the API endpoints using the provided examples

The backend is now ready to support your online course platform frontend!