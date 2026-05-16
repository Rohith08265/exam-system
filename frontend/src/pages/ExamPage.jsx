import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import { useFetch, useTimer } from '../hooks/useHooks';
import { LoadingPage, Spinner } from '../components/Common';
import { formatTimeRemaining } from '../utils/helpers';
import { useNotification } from '../store/NotificationContext';
import api from '../services/api';
import { Clock, AlertCircle } from 'lucide-react';

export const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const timer = useTimer((attempt?.exam?.duration || 60) * 60);

  const { data: examData, loading: examLoading } = useFetch(`/exams/${examId}`);

  useEffect(() => {
    if (examData && !attempt) {
      startExam();
    }
  }, [examData]);

  useEffect(() => {
    if (timer.seconds === 0 && attempt && timer.isActive) {
      autoSubmitExam();
    }
  }, [timer.seconds]);

  const startExam = async () => {
    try {
      const response = await api.post('/attempts/start', {
        examId,
        hostName: window.location.hostname,
      });
      setAttempt(response.data.attempt);
      timer.start();
      showSuccess('Exam started!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to start exam');
      navigate('/exams');
    }
  };

  const saveAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const autoSubmitExam = async () => {
    try {
      setSubmitting(true);
      await api.post(`/attempts/${attempt._id}/submit`, {});
      showSuccess('Exam auto-submitted due to timeout!');
      navigate(`/results/${attempt._id}`);
    } catch (error) {
      showError('Failed to submit exam');
    }
  };

  const handleSubmitExam = async () => {
    if (!window.confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/attempts/${attempt._id}/submit`, {});
      showSuccess('Exam submitted successfully!');
      navigate(`/results/${attempt._id}`);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (examLoading || !attempt) return <LoadingPage />;

  const currentQuestion = examData?.questions?.[currentQuestionIndex];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header with Timer */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">{examData?.title}</h1>
            <p className="text-gray-600">{currentQuestionIndex + 1} of {examData?.questions?.length}</p>
          </div>
          
          <div className={`text-3xl font-bold flex items-center gap-2 ${timer.seconds < 300 ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock size={32} />
            {formatTimeRemaining(timer.seconds)}
          </div>
        </div>

        {timer.seconds < 60 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>Only {Math.ceil(timer.seconds / 60)} minute(s) remaining!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>

                {currentQuestion.image && (
                  <img src={currentQuestion.image} alt="Question" className="mb-4 max-w-full rounded" />
                )}

                <div className="space-y-3">
                  {currentQuestion.type === 'mcq' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <label key={idx} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`q-${currentQuestion._id}`}
                            value={option.text}
                            checked={answers[currentQuestion._id] === option.text}
                            onChange={(e) => saveAnswer(currentQuestion._id, e.target.value)}
                            className="mr-3"
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'true_false' && (
                    <div className="space-y-3">
                      {['True', 'False'].map((value) => (
                        <label key={value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`q-${currentQuestion._id}`}
                            value={value}
                            checked={answers[currentQuestion._id] === value}
                            onChange={(e) => saveAnswer(currentQuestion._id, e.target.value)}
                            className="mr-3"
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'short_answer' && (
                    <textarea
                      value={answers[currentQuestion._id] || ''}
                      onChange={(e) => saveAnswer(currentQuestion._id, e.target.value)}
                      className="input h-32"
                      placeholder="Type your answer here..."
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="btn-secondary"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setCurrentQuestionIndex(Math.min(examData.questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === examData.questions.length - 1}
                    className="btn-secondary"
                  >
                    Next
                  </button>

                  <button
                    onClick={handleSubmitExam}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? <Spinner /> : 'Submit Exam'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold mb-4">Questions</h3>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
              {examData?.questions?.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-full aspect-square font-bold rounded text-sm transition ${
                    currentQuestionIndex === idx
                      ? 'bg-blue-600 text-white'
                      : answers[q._id]
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600"></span>
                Answered
              </p>
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-200"></span>
                Not Answered
              </p>
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600"></span>
                Current
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
