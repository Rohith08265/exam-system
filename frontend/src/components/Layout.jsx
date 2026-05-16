import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Menu, LogOut, User, BookOpen, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <BookOpen size={28} />
          ExamHub
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {user.role === 'student' && (
              <>
                <Link to="/student/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/exams" className="hover:text-blue-600">
                  Exams
                </Link>
                <Link to="/results" className="hover:text-blue-600">
                  Results
                </Link>
              </>
            )}
            {user.role === 'teacher' && (
              <>
                <Link to="/teacher/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/teacher/exams" className="hover:text-blue-600">
                  Exams
                </Link>
                <Link to="/teacher/analytics" className="hover:text-blue-600">
                  Analytics
                </Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/admin/users" className="hover:text-blue-600">
                  Users
                </Link>
                <Link to="/admin/analytics" className="hover:text-blue-600">
                  Analytics
                </Link>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <User size={20} />
                <span className="hidden sm:inline text-sm">{user.firstName}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const Sidebar = ({ items }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white transition-all duration-300 min-h-screen fixed left-0 top-20`}
    >
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded w-full"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="mt-8">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition"
          >
            {item.icon && <item.icon size={20} />}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ExamHub</h3>
            <p className="text-gray-400">Modern Online Examination Management System</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Features</Link></li>
              <li><Link to="/" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Privacy</Link></li>
              <li><Link to="/" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ExamHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const MainLayout = ({ children, showSidebar = false, sidebarItems = [] }) => {
  return (
    <>
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar items={sidebarItems} />}
        <main className={showSidebar ? 'ml-64 flex-1' : 'flex-1'}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};
