import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotLogo } from '../components/RobotLogo';
import { useAppStore } from '../store';
import { Heart, Flame, Zap, Trophy, LogOut, BookOpen, ArrowRight } from 'lucide-react';
import axios from 'axios';

export const DashboardEnhanced = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const courseIcons = {
    'Python': '🐍',
    'C++': '⚙️',
    'MATLAB': '📊',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <RobotLogo size="md" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RoboPlay</h1>
              <p className="text-xs text-gray-500">مرحباً، {user.name}! 👋</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/stats')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition transform hover:scale-105 active:scale-95"
            >
              📊 الإحصائيات
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition transform hover:scale-105 active:scale-95"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* XP Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">إجمالي النقاط</p>
                <p className="text-4xl font-bold mt-2">{user.totalXP}</p>
                <p className="text-blue-100 text-xs mt-1">+{user.xp} هذا الأسبوع</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Zap size={32} className="text-yellow-300" />
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">السترياك الحالي</p>
                <p className="text-4xl font-bold mt-2">{user.streak}</p>
                <p className="text-orange-100 text-xs mt-1">يوم متتالي 🔥</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Flame size={32} />
              </div>
            </div>
          </div>

          {/* Hearts Card */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">القلوب المتبقية</p>
                <p className="text-4xl font-bold mt-2">{user.hearts}</p>
                <p className="text-pink-100 text-xs mt-1">استعد للتعلم ❤️</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Heart size={32} />
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">المستوى الحالي</p>
                <p className="text-4xl font-bold mt-2">Level {user.level}</p>
                <p className="text-green-100 text-xs mt-1">رائع! استمر 🎯</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Trophy size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={28} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">المسارات التعليمية</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">جاري تحميل المسارات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 group"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 text-8xl">
                      {courseIcons[course.language] || '📚'}
                    </div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-3">{courseIcons[course.language] || '📚'}</div>
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className="text-blue-100 text-sm mt-1">{course.language}</p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="space-y-3">
                      {/* Level Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level === 'beginner' ? '🌱 مبتدئ' :
                           course.level === 'intermediate' ? '🌿 متوسط' : '🏔️ متقدم'}
                        </span>
                        <span className="text-gray-600 text-sm font-medium">
                          {course.lessons?.length || 0} درس
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: '45%' }}
                        />
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-4 group-hover:shadow-lg">
                        ابدأ الآن
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white text-center">
          <div className="text-5xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-2">أنت على الطريق الصحيح!</h3>
          <p className="text-purple-100 mb-4">
            استمر في التعلم واكسب المزيد من النقاط والشهادات. كل يوم تعلم هو خطوة نحو النجاح!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-purple-50 transition">
              عرض الإحصائيات
            </button>
            <button className="border-2 border-white text-white font-semibold px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
              شارك إنجازاتك
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
