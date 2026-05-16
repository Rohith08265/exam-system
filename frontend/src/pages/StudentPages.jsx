import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout';
import { useFetch } from '../hooks/useHooks';
import { LoadingPage, EmptyState, ProgressBar, Badge } from '../components/Common';
import { BookOpen, Clock, Users, BarChart3 } from 'lucide-react';
import { formatDate, isExamAvailable, calculatePercentage } from '../utils/helpers';
import api from '../services/api';

export const StudentDashboardPage = () => {
  const { data, loading } = useFetch('/exams?status=published&limit=10');
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/results/student/all?limit=5');
        setRecentResults(response.data.results);

        // Calculate stats
        if (response.data.results.length > 0) {
          const avgPercentage = response.data.results.reduce((sum, r) => sum + r.percentage, 0) /response.data.results.length;
          const passedCount = response.data.results.filter(r => r.isPassed).length;
          
          setStats({
            totalAttempts: response.data.results.length,
            averagePercentage: avgPercentage.toFixed(2),
            passedCount,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Exams</p>
                <p className="text-3xl font-bold">{data?.exams?.length || 0}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Attempts</p>
                <p className="text-3xl font-bold">{stats?.totalAttempts || 0}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Passed</p>
                <p className="text-3xl font-bold">{stats?.passedCount || 0}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average</p>
                <p className="text-3xl font-bold">{stats?.averagePercentage || 0}%</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Exams */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Available Exams</h2>
              {data?.exams?.length === 0 ? (
                <EmptyState
                  title="No Exams Available"
                  description="Check back later for upcoming exams"
                  icon={BookOpen}
                />
              ) : (
                <div className="space-y-4">
                  {data?.exams?.slice(0, 5).map(exam => (
                    <div key={exam._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{exam.title}</h3>
                          <p className="text-gray-600 text-sm">{exam.subject}</p>
                        </div>
                        {isExamAvailable(exam) ? (
                          <Badge variant="success">Available</Badge>
                        ) : (
                          <Badge variant="warning">Scheduled</Badge>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mb-3">
                        <span>Duration: {exam.duration} mins</span>
                        <span>Total Marks: {exam.totalMarks}</span>
                      </div>
                      <button className="btn-primary btn-sm">
                        {isExamAvailable(exam) ? 'Start Exam' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Results */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
              {recentResults.length === 0 ? (
                <EmptyState
                  title="No Results Yet"
                  description="Your exam results will appear here"
                  icon={BarChart3}
                />
              ) : (
                <div className="space-y-3">
                  {recentResults.map(result => (
                    <div key={result._id} className="border rounded-lg p-3">
                      <p className="font-semibold text-sm mb-1">{result.exam.title}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {result.marksObtained}/{result.totalMarks}
                        </span>
                        <Badge variant={result.isPassed ? 'success' : 'danger'}>
                          {result.grade}
                        </Badge>
                      </div>
                      <ProgressBar value={result.marksObtained} max={result.totalMarks} showLabel={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
