import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { NotificationProvider, useNotification } from './store/NotificationContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { NotificationContainer } from './components/Common';

// Auth Pages
import { LoginPage, RegisterPage } from './pages/AuthPages';

// Student Pages
import { StudentDashboardPage } from './pages/StudentPages';
import { ExamPage } from './pages/ExamPage';
import { ResultsPage, LandingPage } from './pages/OtherPages';

// Teacher Pages
import { TeacherDashboardPage, CreateExamPage } from './pages/TeacherPages';

// Admin Pages
import { AdminDashboardPage, AdminUsersPage } from './pages/AdminPages';

const AppContent = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole={['student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams/:examId"
          element={
            <ProtectedRoute requiredRole={['student']}>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute requiredRole={['student']}>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole={['teacher']}>
              <TeacherDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-exam"
          element={
            <ProtectedRoute requiredRole={['teacher']}>
              <CreateExamPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
