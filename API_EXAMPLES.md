# ExamHub - API Response Examples

## Authentication

### Register
**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phone": "+1234567890",
  "department": "Computer Science",
  "enrollmentNumber": "CS2024001"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "_id": "507f...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "isActive": true
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

## Exams

### Create Exam
```bash
POST /api/exams
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Biology Final Exam",
  "description": "Comprehensive biology exam",
  "subject": "Biology",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T12:00:00Z",
  "randomizeQuestions": true,
  "randomizeOptions": true,
  "showCorrectAnswers": true
}
```

### Get Exams
```bash
GET /api/exams?status=published&limit=10
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "exams": [
    {
      "_id": "507f...",
      "title": "Biology Final Exam",
      "subject": "Biology",
      "duration": 120,
      "totalMarks": 100,
      "status": "published",
      "questions": ["q1", "q2", "q3"],
      "createdBy": {
        "_id": "507f...",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com"
      }
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

## Attempts

### Start Exam
```bash
POST /api/attempts/start
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "examId": "507f...",
  "accessCode": "ABC123",
  "hostName": "student-laptop"
}
```

**Response:**
```json
{
  "message": "Attempt started",
  "attempt": {
    "_id": "607f...",
    "startTime": "2024-01-15T10:00:00Z"
  },
  "exam": {
    "_id": "507f...",
    "title": "Biology Final Exam",
    "duration": 120,
    "totalMarks": 100,
    "questions": [
      {
        "_id": "q1",
        "text": "What is photosynthesis?",
        "type": "short_answer",
        "marks": 10,
        "image": null
      }
    ]
  }
}
```

### Submit Exam
```bash
POST /api/attempts/{attemptId}/submit
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "message": "Attempt submitted successfully",
  "result": {
    "_id": "707f...",
    "totalMarks": 100,
    "marksObtained": 75,
    "percentage": 75,
    "isPassed": true,
    "grade": "B"
  }
}
```

## Results

### Get Student Results
```bash
GET /api/results/student/all?limit=10
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "results": [
    {
      "_id": "707f...",
      "student": {...},
      "exam": {
        "_id": "507f...",
        "title": "Biology Final Exam",
        "totalMarks": 100
      },
      "totalMarks": 100,
      "marksObtained": 75,
      "percentage": 75,
      "isPassed": true,
      "grade": "B",
      "questionsAttempted": 45,
      "questionsCorrect": 34,
      "questionsWrong": 11,
      "questionsSkipped": 0,
      "timeSpent": 4200,
      "averageTimePerQuestion": 93.3,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Get Exam Analytics
```bash
GET /api/results/exam/{examId}/analytics
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "totalAttempts": 50,
  "passedCount": 35,
  "failedCount": 15,
  "averageMarks": "72.5",
  "averagePercentage": "72.5",
  "highestMarks": 98,
  "lowestMarks": 22,
  "gradeDistribution": {
    "A": 10,
    "B": 15,
    "C": 10,
    "D": 10,
    "F": 5
  }
}
```

---

For complete API documentation, see [README.md](./README.md)
