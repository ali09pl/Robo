import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotLogo } from '../components/RobotLogo';
import { useAppStore } from '../store';
import { Heart, Flame, Zap, Trophy } from 'lucide-react';
import axios from 'axios';

export const Dashboard = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <RobotLogo size="md" />
            <h1 className="text-2xl font-bold text-gray-800">RoboPlay</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* XP Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي النقاط</p>
                <p className="text-3xl font-bold">{user.totalXP}</p>
              </div>
              <Zap size={32} className="opacity-80" />
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">السترياك الحالي</p>
                <p className="text-3xl font-bold">{user.streak}</p>
              </div>
              <Flame size={32} className="opacity-80" />
            </div>
          </div>

          {/* Hearts Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">القلوب المتبقية</p>
                <p className="text-3xl font-bold">{user.hearts}</p>
              </div>
              <Heart size={32} className="opacity-80" />
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">المستوى الحالي</p>
                <p className="text-3xl font-bold">{user.level}</p>
              </div>
              <Trophy size={32} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">المسارات التعليمية</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">جاري تحميل المسارات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="text-4xl mb-2">{course.icon}</div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-blue-100 text-sm mt-2">{course.language}</p>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level === 'beginner' ? 'مبتدئ' :
                         course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {course.lessons?.length || 0} درس
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
