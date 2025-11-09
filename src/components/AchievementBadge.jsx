import { Trophy, Star, Flame, Heart, Zap } from 'lucide-react';

export const AchievementBadge = ({ type, title, description, xp, unlocked = false }) => {
  const badges = {
    first_lesson: {
      icon: <Star size={32} />,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    streak_7: {
      icon: <Flame size={32} />,
      color: 'from-orange-400 to-red-600',
      bgColor: 'bg-orange-100',
    },
    xp_100: {
      icon: <Zap size={32} />,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-100',
    },
    perfect_score: {
      icon: <Trophy size={32} />,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-100',
    },
    hearts_full: {
      icon: <Heart size={32} />,
      color: 'from-pink-400 to-red-600',
      bgColor: 'bg-pink-100',
    },
  };

  const badge = badges[type] || badges.first_lesson;

  return (
    <div
      className={`p-4 rounded-lg text-center transition-all duration-300 ${
        unlocked
          ? `bg-gradient-to-br ${badge.color} text-white shadow-lg transform hover:scale-105`
          : 'bg-gray-200 text-gray-400 opacity-50'
      }`}
    >
      <div className="flex justify-center mb-2">
        {unlocked ? (
          <div className="text-white">{badge.icon}</div>
        ) : (
          <div className="text-gray-400">{badge.icon}</div>
        )}
      </div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-xs mb-2">{description}</p>
      {unlocked && xp && (
        <div className="text-xs font-semibold">+{xp} XP</div>
      )}
    </div>
  );
};
