import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { StatsPanel } from '../components/StatsPanel';
import { AchievementBadge } from '../components/AchievementBadge';
import { RobotLogo } from '../components/RobotLogo';
import { ArrowLeft, Award, TrendingUp } from 'lucide-react';

export const Stats = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const achievements = [
    {
      id: 1,
      type: 'first_lesson',
      title: 'أول درس',
      description: 'أكمل أول درس لك',
      xp: 50,
      unlocked: true,
    },
    {
      id: 2,
      type: 'streak_7',
      title: 'السترياك الذهبي',
      description: 'حافظ على سترياك 7 أيام',
      xp: 100,
      unlocked: user.streak >= 7,
    },
    {
      id: 3,
      type: 'xp_100',
      title: 'جامع النقاط',
      description: 'اكسب 100 نقطة',
      xp: 75,
      unlocked: user.totalXP >= 100,
    },
    {
      id: 4,
      type: 'perfect_score',
      title: 'النتيجة المثالية',
      description: 'احصل على نتيجة كاملة في تمرين',
      xp: 150,
      unlocked: false,
    },
    {
      id: 5,
      type: 'hearts_full',
      title: 'القلب الكامل',
      description: 'احتفظ بجميع القلوب',
      xp: 200,
      unlocked: user.hearts === 5,
    },
    {
      id: 6,
      type: 'level_up',
      title: 'صعود المستوى',
      description: 'اصعد إلى مستوى جديد',
      xp: 250,
      unlocked: user.level > 1,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlockedCount).length;
  const totalXPFromAchievements = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-500 hover:text-blue-600 transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">إحصائياتك</h1>
              <p className="text-xs text-gray-500">تابع تقدمك والإنجازات</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RobotLogo size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2">
            <StatsPanel user={user} />
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-4">
            {/* Achievements Count */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={20} className="text-yellow-600" />
                الإنجازات
              </h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-600 mb-2">
                  {unlockedCount}/{achievements.length}
                </p>
                <p className="text-sm text-gray-600 mb-4">إنجازات مفتوحة</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* XP from Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                النقاط من الإنجازات
              </h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {totalXPFromAchievements}
                </p>
                <p className="text-sm text-gray-600">نقطة مكتسبة</p>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-lg font-bold mb-2">🌟</p>
              <p className="text-sm">
                "كل إنجاز صغير هو خطوة نحو النجاح الكبير. استمر في التعلم!"
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🏆 جميع الإنجازات</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                type={achievement.type}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏅 الترتيب العام</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">الترتيب</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">المستخدم</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">النقاط</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">المستوى</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">السترياك</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="py-3 px-4 font-bold text-blue-600">1</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{user.name} 👑</td>
                  <td className="py-3 px-4 text-gray-700">{user.totalXP}</td>
                  <td className="py-3 px-4 text-gray-700">Level {user.level}</td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">{user.streak} 🔥</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-600">2</td>
                  <td className="py-3 px-4 text-gray-700">أحمد محمد</td>
                  <td className="py-3 px-4 text-gray-700">1250</td>
                  <td className="py-3 px-4 text-gray-700">Level 8</td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">15 🔥</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-700">فاطمة علي</td>
                  <td className="py-3 px-4 text-gray-700">1100</td>
                  <td className="py-3 px-4 text-gray-700">Level 7</td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">12 🔥</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
