import { Heart, Flame, Zap, Trophy, TrendingUp } from 'lucide-react';

export const StatsPanel = ({ user }) => {
  if (!user) return null;

  // حساب نسبة التقدم
  const nextLevelXP = user.level * 100;
  const currentLevelProgress = (user.xp % 100) / 100 * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 إحصائياتك</h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* XP */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-600">النقاط</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{user.totalXP}</p>
          <p className="text-xs text-gray-500 mt-1">+{user.xp} هذا الأسبوع</p>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-orange-600" />
            <span className="text-sm font-semibold text-gray-600">السترياك</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{user.streak}</p>
          <p className="text-xs text-gray-500 mt-1">يوم متتالي 🔥</p>
        </div>

        {/* Hearts */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} className="text-pink-600" />
            <span className="text-sm font-semibold text-gray-600">القلوب</span>
          </div>
          <p className="text-2xl font-bold text-pink-600">{user.hearts}</p>
          <p className="text-xs text-gray-500 mt-1">من 5</p>
        </div>

        {/* Level */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-green-600" />
            <span className="text-sm font-semibold text-gray-600">المستوى</span>
          </div>
          <p className="text-2xl font-bold text-green-600">Level {user.level}</p>
          <p className="text-xs text-gray-500 mt-1">متقدم ⭐</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">التقدم نحو المستوى التالي</span>
          <span className="text-xs text-gray-500">{Math.round(currentLevelProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${currentLevelProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          اكسب {100 - (user.xp % 100)} نقطة أخرى للوصول للمستوى التالي
        </p>
      </div>

      {/* Achievements */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          الإنجازات
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Achievement 1 */}
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xs font-semibold text-gray-700">أول درس</p>
          </div>

          {/* Achievement 2 */}
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xs font-semibold text-gray-700">سترياك 7 أيام</p>
          </div>

          {/* Achievement 3 */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-semibold text-gray-700">100 نقطة</p>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💪 رائع!</span> أنت تحرز تقدماً رائعاً. استمر في التعلم واكسب المزيد من النقاط والشهادات!
        </p>
      </div>
    </div>
  );
};
