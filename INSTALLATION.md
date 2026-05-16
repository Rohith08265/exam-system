# ExamHub - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (v4.4 or higher)
- Git

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd exam-system
```

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` and update with your settings:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/exam-system

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@examsystem.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=your_session_secret_change_this

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_DIR=./uploads
```

### 2.3 Start MongoDB

**On Windows:**
```bash
mongod
```

**On macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

### 2.4 Start Backend Server

```bash
npm run dev
```

You should see: `Server running on port 5000`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

Copy the example env file:
```bash
cp .env.example .env
```

The default configuration should work for local development.

### 3.3 Start Frontend Server

```bash
npm run dev
```

You should see: `Local: http://localhost:5173/`

## Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/health

## Step 5: Create Demo Data (Optional)

The system includes demo credentials in the login page. You can:

1. Register as a new student or teacher
2. Use demo credentials:
   - Student: student@example.com / password123
   - Teacher: teacher@example.com / password123
   - Admin: admin@example.com / password123

## Docker Setup (Alternative)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. Navigate to the project root:
```bash
cd exam-system
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend: http://localhost:5000/api

4. Stop the services:
```bash
docker-compose down
```

## Production Deployment

### Backend Deployment (Heroku Example)

1. Create Heroku account and install Heroku CLI
2. Login:
```bash
heroku login
```

3. Create app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_url
```

5. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Vercel Example)

1. Create Vercel account
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in production `.env`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
```bash
# For port 5000
lsof -i :5000
kill -9 <PID>

# For port 5173
lsof -i :5173
kill -9 <PID>
```

### CORS Error
- Ensure `FRONTEND_URL` is correct in backend `.env`
- Add allowed origin to CORS configuration

### Build Errors
- Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend watches for file changes with nodemon
- Frontend has Vite hot module replacement (HMR)

### Database Management
- Use MongoDB Compass for visual database management
- Connect to `mongodb://localhost:27017`

### Testing API
- Use Postman or VS Code REST Client
- API documentation available on `/api` endpoint

### Debugging
Backend:
```bash
npm run dev  # Already includes debugging
```

Frontend:
- Use browser DevTools (F12)
- React DevTools browser extension

## Performance Optimization

### Backend
- Enable database indexing
- Use pagination for large datasets
- Implement caching strategies
- Use compression middleware

### Frontend
- Build optimization: `npm run build`
- Enable lazy loading for routes
- Optimize images
- Use production build for deployment

## Security Checklist

- [ ] Change all default credentials
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Configure rate limiting
- [ ] Enable input validation
- [ ] Use environment variables for secrets
- [ ] Regular security updates

## Support & Documentation

For issues or questions:
1. Check README.md
2. Review API documentation
3. Check browser console for errors
4. Check backend logs in terminal

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

Happy coding! 🚀
