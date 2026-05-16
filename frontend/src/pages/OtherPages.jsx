import React from 'react';
import { MainLayout } from '../components/Layout';
import { useFetch } from '../hooks/useHooks';
import { LoadingPage, EmptyState, Badge } from '../components/Common';
import { BarChart3, TrendingUp } from 'lucide-react';
import { formatDate, calculatePercentage } from '../utils/helpers';
import api from '../services/api';
import { useState, useEffect } from 'react';

export const ResultsPage = () => {
  const { data, loading } = useFetch('/results/student/all?limit=50');

  if (loading) return <LoadingPage />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Results</h1>

        {data?.results?.length === 0 ? (
          <EmptyState
            title="No Results Yet"
            description="Your exam results will appear here after submission"
            icon={BarChart3}
          />
        ) : (
          <div className="grid gap-4">
            {data?.results?.map(result => (
              <div key={result._id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{result.exam.title}</h3>
                    <p className="text-gray-600 text-sm">{result.exam.subject}</p>
                  </div>
                  <Badge variant={result.isPassed ? 'success' : 'danger'}>
                    {result.grade}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Score</p>
                    <p className="text-2xl font-bold">{result.marksObtained}/{result.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Percentage</p>
                    <p className="text-2xl font-bold">{result.percentage.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className={`text-lg font-bold ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isPassed ? 'PASSED' : 'FAILED'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="text-sm">{formatDate(result.createdAt).split(',')[0]}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <div className="text-center flex-1">
                    <p className="text-gray-600 text-sm">Attempted</p>
                    <p className="text-lg font-semibold">{result.questionsAttempted}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-gray-600 text-sm">Correct</p>
                    <p className="text-lg font-semibold text-green-600">{result.questionsCorrect}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-gray-600 text-sm">Wrong</p>
                    <p className="text-lg font-semibold text-red-600">{result.questionsWrong}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-gray-600 text-sm">Skipped</p>
                    <p className="text-lg font-semibold">{result.questionsSkipped}</p>
                  </div>
                </div>

                <button className="btn-primary btn-sm mt-4">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export const LandingPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Online Examination Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and conduct exams with confidence. A modern platform designed for educational institutions.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/register?role=student" className="btn-primary btn-lg">Get Started as Student</a>
            <a href="/register?role=teacher" className="btn-secondary btn-lg">Register as Teacher</a>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📝', title: 'Easy Exam Creation', description: 'Create exams with MCQ, True/False, and short answer questions' },
              { icon: '⏱️', title: 'Real-time Timer', description: 'Auto-submit exams with strict time management' },
              { icon: '📊', title: 'Detailed Analytics', description: 'Comprehensive reports and performance analytics' },
              { icon: '🔒', title: 'Secure', description: 'JWT-based authentication and role-based access control' },
              { icon: '📱', title: 'Responsive Design', description: 'Seamless experience on desktop, tablet, and mobile' },
              { icon: '⚡', title: 'Performance', description: 'Fast-loading interface with optimized architecture' },
            ].map((feature, idx) => (
              <div key={idx} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">About ExamHub</h2>
            <p className="text-lg text-gray-600 mb-4">
              ExamHub is a modern, scalable online examination management system built with cutting-edge technology. 
              It provides a complete solution for educational institutions to conduct exams, manage questions, and analyze student performance.
            </p>
            <p className="text-lg text-gray-600">
              Our platform is designed with user experience in mind, offering an intuitive interface for students, powerful tools for teachers, and comprehensive analytics for administrators.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};
