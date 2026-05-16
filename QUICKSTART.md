# ExamHub Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- Git

### Quick Start

#### On Windows:
```bash
.\quick-start.bat
```

#### On macOS/Linux:
```bash
chmod +x quick-start.sh
./quick-start.sh
```

#### Manual Setup:
1. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

2. **Frontend (new terminal):**
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **MongoDB:**
   ```bash
   mongod
   ```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Status: http://localhost:5000/health

### Demo Credentials
- **Student**: student@example.com / password123
- **Teacher**: teacher@example.com / password123  
- **Admin**: admin@example.com / password123

## 📚 Documentation

- [Installation Guide](./INSTALLATION.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [API Documentation](./README.md#api-documentation)

## 🐳 Docker Setup

```bash
docker-compose up --build
```

Access on: http://localhost

## 🆘 Troubleshooting

**MongoDB not connecting?**
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

**Port already in use?**
```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>
```

**Dependencies issues?**
```bash
rm -rf node_modules
npm install
```

## 📖 Features

✅ Complete exam management system
✅ Role-based access (Student, Teacher, Admin)
✅ Real-time exam taking with timer
✅ Instant result calculation
✅ Performance analytics
✅ Responsive mobile design
✅ Secure JWT authentication
✅ Email notifications (configurable)

## 🛠 Tech Stack

- React 18 + Vite
- Node.js + Express
- MongoDB
- Tailwind CSS
- JWT Authentication

## 📞 Support

For issues or questions, check:
1. [Installation Guide](./INSTALLATION.md)
2. [Project Structure](./PROJECT_STRUCTURE.md)
3. Backend logs in terminal
4. Browser console for frontend errors

---

Happy learning! 📚
