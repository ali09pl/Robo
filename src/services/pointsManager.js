// خدمة إدارة النقاط والسترياك والقلوب

export const pointsManager = {
  // حساب النقاط بناءً على صعوبة التمرين
  calculateXP: (difficulty, exerciseType = 'code') => {
    const baseXP = {
      easy: 10,
      medium: 25,
      hard: 50,
    };

    const typeMultiplier = {
      code: 1,
      quiz: 1.5,
      project: 2,
    };

    return Math.round(baseXP[difficulty] * typeMultiplier[exerciseType]);
  },

  // تحديث السترياك
  updateStreak: (lastActivityDate) => {
    const today = new Date();
    const lastDate = new Date(lastActivityDate);

    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // نفس اليوم - لا تغيير
      return { streakUpdated: false, newStreak: null };
    } else if (diffDays === 1) {
      // يوم واحد - زيادة السترياك
      return { streakUpdated: true, newStreak: 1 };
    } else {
      // أكثر من يوم - إعادة تعيين السترياك
      return { streakUpdated: true, newStreak: 0 };
    }
  },

  // إدارة القلوب
  loseHeart: (currentHearts) => {
    return Math.max(0, currentHearts - 1);
  },

  gainHeart: (currentHearts, maxHearts = 5) => {
    return Math.min(maxHearts, currentHearts + 1);
  },

  // حساب مستوى المستخدم
  calculateLevel: (totalXP) => {
    return Math.floor(totalXP / 100) + 1;
  },

  // حساب XP المتبقي للمستوى التالي
  xpToNextLevel: (totalXP) => {
    const nextLevelThreshold = (Math.floor(totalXP / 100) + 1) * 100;
    return nextLevelThreshold - totalXP;
  },

  // حساب نسبة التقدم للمستوى التالي
  levelProgress: (totalXP) => {
    const currentLevelStart = Math.floor(totalXP / 100) * 100;
    const nextLevelStart = currentLevelStart + 100;
    const progress = totalXP - currentLevelStart;
    return (progress / 100) * 100;
  },

  // منح إنجاز
  grantAchievement: (achievements, achievementId, xpReward) => {
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      return { newAchievement: true, xpReward };
    }
    return { newAchievement: false, xpReward: 0 };
  },

  // فحص الإنجازات المتاحة
  checkAchievements: (user) => {
    const newAchievements = [];

    // أول درس
    if (user.lessonsCompleted >= 1 && !user.achievements?.includes('first_lesson')) {
      newAchievements.push({
        id: 'first_lesson',
        title: 'أول درس',
        xp: 50,
      });
    }

    // سترياك 7 أيام
    if (user.streak >= 7 && !user.achievements?.includes('streak_7')) {
      newAchievements.push({
        id: 'streak_7',
        title: 'السترياك الذهبي',
        xp: 100,
      });
    }

    // 100 نقطة
    if (user.totalXP >= 100 && !user.achievements?.includes('xp_100')) {
      newAchievements.push({
        id: 'xp_100',
        title: 'جامع النقاط',
        xp: 75,
      });
    }

    // مستوى 5
    if (user.level >= 5 && !user.achievements?.includes('level_5')) {
      newAchievements.push({
        id: 'level_5',
        title: 'صعود المستويات',
        xp: 150,
      });
    }

    // قلوب كاملة
    if (user.hearts === 5 && !user.achievements?.includes('hearts_full')) {
      newAchievements.push({
        id: 'hearts_full',
        title: 'القلب الكامل',
        xp: 200,
      });
    }

    return newAchievements;
  },

  // حساب المكافآت الإجمالية
  calculateTotalRewards: (exerciseData) => {
    let totalXP = 0;
    let achievements = [];

    if (exerciseData.baseXP) {
      totalXP += exerciseData.baseXP;
    }

    if (exerciseData.bonusXP) {
      totalXP += exerciseData.bonusXP;
    }

    if (exerciseData.achievements) {
      achievements = exerciseData.achievements;
    }

    return {
      totalXP,
      achievements,
      message: `تم كسب ${totalXP} نقطة!`,
    };
  },

  // نظام المكافآت اليومية
  getDailyReward: (lastClaimDate) => {
    const today = new Date().toDateString();
    const lastClaim = new Date(lastClaimDate).toDateString();

    if (today === lastClaim) {
      return { canClaim: false, message: 'لقد ادعيت المكافأة اليومية بالفعل' };
    }

    return {
      canClaim: true,
      xp: 25,
      message: 'ادعِ مكافأتك اليومية: 25 نقطة XP',
    };
  },
};

// نظام الترتيب
export const leaderboardManager = {
  // ترتيب المستخدمين
  rankUsers: (users) => {
    return users
      .sort((a, b) => {
        // ترتيب أساسي حسب النقاط
        if (b.totalXP !== a.totalXP) {
          return b.totalXP - a.totalXP;
        }
        // إذا تساوت النقاط، ترتيب حسب المستوى
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        // إذا تساوى المستوى، ترتيب حسب السترياك
        return b.streak - a.streak;
      })
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '',
      }));
  },

  // الحصول على ترتيب المستخدم
  getUserRank: (users, userId) => {
    const ranked = this.rankUsers(users);
    return ranked.find(u => u.id === userId)?.rank || null;
  },

  // الحصول على أفضل 10 مستخدمين
  getTopUsers: (users, limit = 10) => {
    return this.rankUsers(users).slice(0, limit);
  },
};
