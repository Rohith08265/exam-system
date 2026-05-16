# ExamHub - Online Examination Management System

A comprehensive, modern online examination management system built with React, Node.js, and MongoDB.

## Features

### Student Features
- View available exams
- Attempt exams with real-time timer
- Auto-save answers
- Responsive exam interface
- View completed exam results
- Performance analytics
- Exam history

### Teacher Features
- Create and manage exams
- Add/edit/delete questions (MCQ, True/False, Short Answer)
- Randomize questions and options
- Schedule exams
- View student performance
- Export results
- Upload questions in bulk

### Admin Features
- Full system control
- Manage users (students, teachers)
- Manage exams and questions
- Delete or modify any data
- Dashboard analytics
- Control permissions
- System activity logs

## Tech Stack

### Frontend
- React 18.2
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt
- Joi Validation

### Database
- MongoDB

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/exam-system
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update `src/services/api.js` with backend URL if needed.

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Exams
- `POST /api/exams` - Create exam (teacher/admin)
- `GET /api/exams` - Get exams
- `GET /api/exams/:id` - Get exam by ID
- `PUT /api/exams/:id` - Update exam (teacher/admin)
- `POST /api/exams/:id/publish` - Publish exam (teacher/admin)
- `POST /api/exams/:id/questions` - Add questions to exam
- `DELETE /api/exams/:id` - Delete exam (teacher/admin)

### Questions
- `POST /api/questions` - Create question (teacher/admin)
- `GET /api/questions` - Get questions
- `GET /api/questions/:id` - Get question by ID
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/bulk/upload` - Bulk upload questions

### Attempts
- `POST /api/attempts/start` - Start exam attempt
- `POST /api/attempts/:attemptId/answer` - Save answer
- `POST /api/attempts/:attemptId/submit` - Submit exam
- `GET /api/attempts/student/all` - Get student's attempts

### Results
- `GET /api/results/:resultId` - Get result by ID
- `GET /api/results/student/all` - Get student's results
- `GET /api/results/exam/:examId/results` - Get exam results (teacher/admin)
- `GET /api/results/exam/:examId/leaderboard` - Get leaderboard
- `GET /api/results/exam/:examId/analytics` - Get analytics
- `GET /api/results/exam/:examId/export-csv` - Export results as CSV

## Folder Structure

```
exam-system/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── questionController.js
│   │   ├── examController.js
│   │   ├── attemptController.js
│   │   └── resultController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Exam.js
│   │   ├── Attempt.js
│   │   ├── Result.js
│   │   ├── Notification.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── examRoutes.js
│   │   ├── attemptRoutes.js
│   │   └── resultRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── auditLogger.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── email.js
│   ├── validators/
│   │   └── schemas.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Common.jsx
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── AuthPages.jsx
    │   │   ├── StudentPages.jsx
    │   │   ├── ExamPage.jsx
    │   │   ├── TeacherPages.jsx
    │   │   ├── AdminPages.jsx
    │   │   └── OtherPages.jsx
    │   ├── store/
    │   │   ├── AuthContext.js
    │   │   └── NotificationContext.js
    │   ├── hooks/
    │   │   └── useHooks.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── services/
    │   │   └── api.js
    │   ├── index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Database Models

### User
- firstName, lastName, email, password
- role (student, teacher, admin)
- phone, profileImage, bio, department
- enrollmentNumber, isActive, isEmailVerified
- lastLogin, loginAttempts, lockUntil

### Exam
- title, description, subject
- duration, totalMarks, passingMarks
- questions, status (draft, published, archived)
- Multiple configuration options (randomize, showAnswers, etc.)
- startDate, endDate, accessCode
- enrolledStudents, createdBy

### Question
- text, type (mcq, true_false, short_answer)
- options, correctAnswer, explanation
- marks, difficulty, tags
- image, createdBy, isActive

### Attempt
- student, exam, startTime, endTime
- status, answers, totalMarksObtained
- percentage, isPassed, timeSpent
- questionsAttempted, questionsCorrect, questionsWrong, questionsSkipped
- cheatingDetected, hostName, ipAddress

### Result
- student, exam, attempt
- marksObtained, percentage, grade
- questionsAttempted, questionsCorrect, questionsWrong, questionsSkipped
- answerDetails, timeSpent, averageTimePerQuestion
- rank, isReviewed, reviewComments

## Demo Credentials

### Student
- Email: student@example.com
- Password: password123

### Teacher
- Email: teacher@example.com
- Password: password123

### Admin
- Email: admin@example.com
- Password: password123

## Deployment

### Docker
Create `Dockerfile` for both frontend and backend, then use `docker-compose` for orchestration.

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection string
- JWT secret keys
- Email credentials
- CORS origins
- Frontend URL

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Joi
- Rate limiting
- CORS protection
- HTTPS ready
- Audit logging

## Performance Optimizations
- Database indexing
- Pagination
- Lazy loading
- Code splitting
- Minification
- Caching strategies

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what would you like to change.

## License
MIT License

## Support
For support, email support@examhub.com or open an issue in the GitHub repository.

---

Built with ❤️ by the ExamHub Team
