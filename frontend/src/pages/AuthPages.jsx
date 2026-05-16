import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useNotification } from '../store/NotificationContext';
import { useForm } from '../hooks/useHooks';
import { Spinner } from '../components/Common';
import { validateEmail, validatePasswordStrength } from '../utils/helpers';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      try {
        const email = values.email.trim();
        if (!validateEmail(email)) {
          throw new Error('Invalid email');
        }
        await login(email, values.password);
        showSuccess('Login successful!');
        navigate('/');
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Access your exam dashboard</p>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="your@email.com"
              {...form.handleChange}
              {...form.handleBlur}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="input pr-10"
                placeholder="••••••••"
                {...form.handleChange}
                {...form.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forget-password" className="text-blue-600 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={form.isSubmitting}>
            {form.isSubmitting ? <Spinner /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Demo credentials:</p>
          <p>Student: student@example.com | password123</p>
          <p>Teacher: teacher@example.com | password123</p>
          <p>Admin: admin@example.com | password123</p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      department: '',
      enrollmentNumber: '',
    },
    async (values) => {
      try {
        const email = values.email.trim();
        if (!validateEmail(email)) {
          throw new Error('Invalid email');
        }
        if (values.password !== values.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (values.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        await register({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: email,
          password: values.password,
          role,
          phone: values.phone.trim(),
          department: values.department.trim(),
          enrollmentNumber: values.enrollmentNumber.trim(),
        });

        showSuccess('Registration successful! Welcome to ExamHub');
        navigate('/');
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-8">Take exams with confidence</p>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              className="input"
              placeholder="First Name"
              {...form.handleChange}
            />
            <input
              type="text"
              name="lastName"
              className="input"
              placeholder="Last Name"
              {...form.handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            className="input"
            placeholder="Email"
            {...form.handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-2">I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {role === 'student' && (
            <>
              <input
                type="text"
                name="enrollmentNumber"
                className="input"
                placeholder="Enrollment Number"
                {...form.handleChange}
              />
              <input
                type="text"
                name="department"
                className="input"
                placeholder="Department"
                {...form.handleChange}
              />
            </>
          )}

          <input
            type="tel"
            name="phone"
            className="input"
            placeholder="Phone (optional)"
            {...form.handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="input"
              placeholder="Password"
              {...form.handleChange}
            />
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            className="input"
            placeholder="Confirm Password"
            {...form.handleChange}
          />

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show password</span>
          </label>

          <button type="submit" className="btn-primary w-full" disabled={form.isSubmitting}>
            {form.isSubmitting ? <Spinner /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
