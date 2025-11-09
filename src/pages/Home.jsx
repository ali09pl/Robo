import { useNavigate } from 'react-router-dom';
import { RobotLogo } from '../components/RobotLogo';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <RobotLogo size="md" />
            <h1 className="text-2xl font-bold text-gray-800">RoboPlay</h1>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            تسجيل الدخول
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <RobotLogo size="xl" />
        </div>
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          مرحباً بك في RoboPlay
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          منصة تعليمية تفاعلية شاملة لتعليم هندسة الذكاء الاصطناعي والبرمجة بطريقة ممتعة وفعالة
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="px-8 py-3 bg-blue-500 text-white text-lg font-bold rounded-lg hover:bg-blue-600 transition"
        >
          ابدأ الآن
        </button>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ميزات المنصة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">مسارات تعليمية متقدمة</h4>
              <p className="text-gray-600">
                تعلم Python و C++ و MATLAB من خلال مسارات منظمة وشاملة
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💻</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">محرر كود مدمج</h4>
              <p className="text-gray-600">
                كتابة وتشغيل الكود مباشرة في المتصفح دون الحاجة لأي إعدادات
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">نظام تحفيز متقدم</h4>
              <p className="text-gray-600">
                اكسب نقاط XP وحافظ على سترياكك اليومي واحصل على شهادات
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
