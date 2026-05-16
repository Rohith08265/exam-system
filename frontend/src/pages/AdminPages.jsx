import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout';
import { useFetch } from '../hooks/useHooks';
import { LoadingPage, EmptyState } from '../components/Common';
import { Users, BookOpen, Activity, BarChart3, Trash2 } from 'lucide-react';
import { useNotification } from '../store/NotificationContext';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const { data: users, loading: usersLoading, refetch } = useFetch('/users?limit=10');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allUsers = await api.get('/users?limit=1000');
        setStats({
          totalUsers: allUsers.data.pagination?.total || 0,
          students: allUsers.data.users?.filter(u => u.role === 'student').length || 0,
          teachers: allUsers.data.users?.filter(u => u.role === 'teacher').length || 0,
          admins: allUsers.data.users?.filter(u => u.role === 'admin').length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (usersLoading) return <LoadingPage />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Students</p>
                <p className="text-4xl font-bold text-green-600">{stats?.students || 0}</p>
              </div>
              <BookOpen className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Teachers</p>
                <p className="text-4xl font-bold text-blue-600">{stats?.teachers || 0}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-4xl font-bold text-orange-600">{stats?.admins || 0}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
          {users?.users?.length === 0 ? (
            <EmptyState
              title="No Users"
              description="No users registered yet"
              icon={Users}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.users?.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <span className="badge badge-primary">{user.role}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
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

export const AdminUsersPage = () => {
  const { data, loading, refetch } = useFetch('/users?limit=50');
  const { showSuccess, showError } = useNotification();

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      showSuccess('User deleted successfully');
      refetch();
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

        <div className="card">
          {data?.users?.length === 0 ? (
            <EmptyState
              title="No Users"
              description="No users found"
              icon={Users}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Joined</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <span className="badge badge-primary">{user.role}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={user.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
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
