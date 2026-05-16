# Project Structure

## Overview

ExamHub is a full-stack examination management system with a clear separation between backend and frontend.

```
exam-system/
├── backend/                          # Node.js + Express backend
│   ├── config/
│   │   ├── database.js              # MongoDB connection
│   │   └── constants.js             # App constants and enums
│   │
│   ├── controllers/                  # Business logic handlers
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── questionController.js    # Question operations
│   │   ├── examController.js        # Exam management
│   │   ├── attemptController.js     # Exam attempt handling
│   │   └── resultController.js      # Result and analytics
│   │
│   ├── models/                       # MongoDB schemas
│   │   ├── User.js                  # User model with auth methods
│   │   ├── Question.js              # Question model
│   │   ├── Exam.js                  # Exam model
│   │   ├── Attempt.js               # Exam attempt model
│   │   ├── Result.js                # Result and scoring model
│   │   ├── Notification.js          # Notifications model
│   │   └── AuditLog.js              # Audit trail model
│   │
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── questionRoutes.js        # Question endpoints
│   │   ├── examRoutes.js            # Exam endpoints
│   │   ├── attemptRoutes.js         # Attempt endpoints
│   │   └── resultRoutes.js          # Result endpoints
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                  # JWT verification and authorization
│   │   ├── validation.js            # Request validation with Joi
│   │   ├── errorHandler.js          # Global error handler
│   │   └── auditLogger.js           # Audit trail middleware
│   │
│   ├── utils/                        # Utility functions
│   │   ├── jwt.js                   # JWT token generation
│   │   └── email.js                 # Email sending utilities
│   │
│   ├── validators/                   # Joi validation schemas
│   │   └── schemas.js               # All validation schemas
│   │
│   ├── server.js                     # Express app setup
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment variables example
│   └── Dockerfile                    # Docker configuration
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Common.jsx           # Common UI components (Modal, Spinner, etc.)
│   │   │   ├── Layout.jsx           # Layout components (Header, Sidebar, Footer)
│   │   │   └── ProtectedRoute.jsx   # Route protection wrappers
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── AuthPages.jsx        # Login and Register pages
│   │   │   ├── StudentPages.jsx     # Student dashboard
│   │   │   ├── ExamPage.jsx         # Exam taking page
│   │   │   ├── TeacherPages.jsx     # Teacher dashboard and exam creation
│   │   │   ├── AdminPages.jsx       # Admin dashboard and management
│   │   │   └── OtherPages.jsx       # Results, Landing page, etc.
│   │   │
│   │   ├── store/                    # State management
│   │   │   ├── AuthContext.js       # Auth state and operations
│   │   │   └── NotificationContext.js # Notification state
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useHooks.js          # useFetch, useForm, useTimer, etc.
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   └── helpers.js           # Date formatting, validation, etc.
│   │   │
│   │   ├── services/                 # API integration
│   │   │   └── api.js               # Axios instance and interceptors
│   │   │
│   │   ├── assets/                   # Static assets
│   │   │
│   │   ├── index.css                 # Global styles with Tailwind
│   │   ├── App.jsx                   # Main app component with routing
│   │   └── main.jsx                  # React entry point
│   │
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── .env.example                  # Environment variables example
│   ├── package.json                  # Dependencies
│   ├── Dockerfile                    # Docker configuration
│   └── .gitignore
│
├── docker-compose.yml                # Multi-container setup
├── README.md                          # Project overview and features
├── INSTALLATION.md                   # Installation guide
├── PROJECT_STRUCTURE.md              # This file
└── .gitignore
```

## Key Directories Explained

### Backend Structure

**config/**
- Database connection configuration
- Application constants (roles, permissions, status enums)

**controllers/**
- Contains business logic for each resource
- Handles requests, validates, calls models, returns responses
- One controller per resource type

**models/**
- MongoDB Mongoose schemas
- Data validation at schema level
- Custom methods for data operations

**middleware/**
- JWT verification and role checking
- Input validation
- Error handling
- Audit logging

**routes/**
- API endpoint definitions
- Maps HTTP methods to controllers
- Applies middleware for specific routes

### Frontend Structure

**components/**
- Reusable UI components
- Layout components (Header, Sidebar)
- Route protection wrappers

**pages/**
- Full page components
- One page per route
- Combines multiple components

**store/**
- Context API for state management
- Auth state
- Notification state
- Can be extended with Redux if needed

**hooks/**
- Custom React hooks
- Data fetching (useFetch)
- Form state management (useForm)
- Timer functionality (useTimer)

**services/**
- API communication layer
- Axios configuration
- Request/response interceptors
- Token refresh logic

## Data Flow

### Authentication Flow
```
User Input → LoginPage → useAuth.login() → API.post(/auth/login)
→ Backend validates → Returns tokens → Store in localStorage
→ AuthContext updated → User redirected
```

### Exam Taking Flow
```
Student views exams → Clicks "Start Exam" → ExamPage loads
→ useFetch loads exam data → ExamPage displays questions
→ Student answers → saveAnswer() updates state → Submit
→ API.post(/attempts/:id/submit) → Backend calculates score
→ Result created → Redirected to results page
```

### Teaching Flow
```
Teacher logs in → TeacherDashboard → Create Exam
→ Add questions → Publish → Set schedule → Students attempt
→ View analytics → Export results
```

### Admin Flow
```
Admin logs in → AdminDashboard → Manage users/exams
→ View system analytics → Audit logs
```

## API Request Flow

```
Frontend (React)
    ↓
axios instance (with interceptors)
    ↓
Backend (Express)
    ↓
Middleware (validation, auth, etc.)
    ↓
Controller (business logic)
    ↓
Model (database operations)
    ↓
MongoDB
    ↓
Response back through same chain
```

## State Management Hierarchy

```
App (root)
├── AuthProvider
│   ├── user
│   ├── loading
│   ├── error
│   └── methods (login, logout, register)
│
├── NotificationProvider
│   ├── notifications (array)
│   └── methods (add, remove, showSuccess, etc.)
│
└── Components using these contexts
```

## Database Relationships

```
User (1) ---- (many) Exam (as creator)
User (many) ---- (many) Exam (enrolled students)
Exam (1) ---- (many) Question
Exam (1) ---- (many) Attempt
Attempt (1) ---- (1) Result
Question (many) ---- (many) Attempt (through answers)
User (1) ---- (many) Attempt (as student)
User (1) ---- (many) Result (as student)
```

## Middleware Execution Order

1. Security middleware (helmet, cors)
2. Body parsing
3. Audit logging
4. Route-specific middleware
5. Controller execution
6. Error handling

## Component Hierarchy (Frontend)

```
App
├── AuthProvider
│   └── NotificationProvider
│       ├── Routes
│       │   ├── PublicRoute
│       │   │   └── LoginPage
│       │   │       └── MainLayout (Header, Footer only)
│       │   │
│       │   ├── ProtectedRoute (Student)
│       │   │   ├── StudentDashboardPage
│       │   │   │   └── MainLayout
│       │   │   │       ├── Header
│       │   │   │       ├── Stats cards
│       │   │   │       └── Footer
│       │   │   │
│       │   │   └── ExamPage
│       │   │       └── MainLayout
│       │   │           ├── Header (with timer)
│       │   │           ├── ExamInterface
│       │   │           └── QuestionNavigator
│       │   │
│       │   ├── ProtectedRoute (Teacher)
│       │   │   ├── TeacherDashboardPage
│       │   │   └── CreateExamPage
│       │   │
│       │   └── ProtectedRoute (Admin)
│       │       ├── AdminDashboardPage
│       │       └── AdminUsersPage
│       │
│       └── NotificationContainer
```

## Configuration Files

- **vite.config.js** - Vite build tool config
- **tailwind.config.js** - Tailwind CSS customization
- **package.json** - Dependencies and scripts
- **.env** - Environment variables (not committed)
- **.env.example** - Template for environment variables

## Build Output

- **Backend**: Runs directly from source (Node.js)
- **Frontend**: `npm run build` creates `/dist` folder for production

## Security Structure

1. Password hashing (bcryptjs)
2. JWT tokens (stored in localStorage)
3. Role-based access control (middleware)
4. Input validation (Joi)
5. Rate limiting
6. CORS protection
7. Audit logging

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Lazy loading in React
- Image optimization
- API response caching
- Code splitting in frontend

---

This structure ensures:
- Clean separation of concerns
- Easy to maintain and scale
- Secure and performant
- Following industry best practices
