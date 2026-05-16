import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout';
import { useFetch, useForm } from '../hooks/useHooks';
import { LoadingPage, EmptyState, Modal, Spinner } from '../components/Common';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { useNotification } from '../store/NotificationContext';
import api from '../services/api';

export const TeacherDashboardPage = () => {
  const { data, loading, refetch } = useFetch('/exams?limit=10');
  const [stats, setStats] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/exams?limit=100');
        if (response.data.exams) {
          setStats({
            totalExams: response.data.exams.length,
            publishedExams: response.data.exams.filter(e => e.status === 'published').length,
            draftExams: response.data.exams.filter(e => e.status === 'draft').length,
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <a href="/teacher/create-exam" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Create Exam
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Total Exams</p>
            <p className="text-4xl font-bold">{stats?.totalExams || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Published</p>
            <p className="text-4xl font-bold text-green-600">{stats?.publishedExams || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Drafts</p>
            <p className="text-4xl font-bold text-blue-600">{stats?.draftExams || 0}</p>
          </div>
        </div>

        {/* Exams List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">My Exams</h2>
          {data?.exams?.length === 0 ? (
            <EmptyState
              title="No Exams Yet"
              description="Create your first exam to get started"
              icon={BookOpen}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Questions</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.exams?.map(exam => (
                    <tr key={exam._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{exam.title}</td>
                      <td className="px-4 py-2">{exam.subject}</td>
                      <td className="px-4 py-2">
                        <span className={`badge ${exam.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{exam.questions?.length || 0}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export const CreateExamPage = () => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const form = useForm(
    {
      title: '',
      description: '',
      subject: '',
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      startDate: '',
      endDate: '',
      randomizeQuestions: false,
      randomizeOptions: false,
      showCorrectAnswers: true,
    },
    async (values) => {
      try {
        setLoading(true);
        await api.post('/exams', values);
        showSuccess('Exam created successfully!');
        form.reset();
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to create exam');
      } finally {
        setLoading(false);
      }
    }
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-8">Create New Exam</h1>

          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Exam Title</label>
                <input
                  type="text"
                  name="title"
                  className="input"
                  placeholder="e.g., Mathematics Final"
                  {...form.handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="input"
                  placeholder="e.g., Mathematics"
                  {...form.handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                className="input h-24"
                placeholder="Exam description..."
                {...form.handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  className="input"
                  min="1"
                  {...form.handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  className="input"
                  min="1"
                  {...form.handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Passing Marks</label>
                <input
                  type="number"
                  name="passingMarks"
                  className="input"
                  min="0"
                  {...form.handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  className="input"
                  {...form.handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  className="input"
                  {...form.handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="randomizeQuestions"
                  checked={form.values.randomizeQuestions}
                  onChange={form.handleChange}
                  className="mr-2"
                />
                <span>Randomize Questions</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="randomizeOptions"
                  checked={form.values.randomizeOptions}
                  onChange={form.handleChange}
                  className="mr-2"
                />
                <span>Randomize Options</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="showCorrectAnswers"
                  checked={form.values.showCorrectAnswers}
                  onChange={form.handleChange}
                  className="mr-2"
                />
                <span>Show Correct Answers</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Spinner /> : 'Create Exam'}
              </button>
              <a href="/teacher/dashboard" className="btn-secondary">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
