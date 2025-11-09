import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotLogo } from '../components/RobotLogo';
import { useAppStore } from '../store';
import axios from 'axios';

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'هل لديك خبرة سابقة في البرمجة؟',
    options: [
      { value: 'none', label: 'لا، أنا مبتدئ تماماً' },
      { value: 'basic', label: 'نعم، لدي خبرة أساسية' },
      { value: 'intermediate', label: 'لدي خبرة متوسطة' },
      { value: 'advanced', label: 'لدي خبرة متقدمة' },
    ],
  },
  {
    id: 2,
    question: 'أي لغة برمجة تفضل؟',
    options: [
      { value: 'python', label: 'Python' },
      { value: 'cpp', label: 'C++' },
      { value: 'matlab', label: 'MATLAB' },
      { value: 'other', label: 'أخرى' },
    ],
  },
  {
    id: 3,
    question: 'ما هو هدفك الرئيسي من هذه المنصة؟',
    options: [
      { value: 'learn_basics', label: 'تعلم أساسيات البرمجة' },
      { value: 'ai_ml', label: 'تعلم الذكاء الاصطناعي والتعلم الآلي' },
      { value: 'robotics', label: 'تعلم الروبوتات' },
      { value: 'computer_vision', label: 'تعلم الرؤية الحاسوبية' },
    ],
  },
  {
    id: 4,
    question: 'كم ساعة يومياً يمكنك تخصيصها للتعلم؟',
    options: [
      { value: 'less_1', label: 'أقل من ساعة' },
      { value: '1_2', label: '1-2 ساعة' },
      { value: '2_3', label: '2-3 ساعات' },
      { value: 'more_3', label: 'أكثر من 3 ساعات' },
    ],
  },
  {
    id: 5,
    question: 'هل تفضل التعلم من خلال المشاريع العملية؟',
    options: [
      { value: 'yes', label: 'نعم، بالتأكيد' },
      { value: 'maybe', label: 'ربما' },
      { value: 'no', label: 'لا، أفضل النظرية' },
    ],
  },
];

export const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [ASSESSMENT_QUESTIONS[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/assessment/submit', {
        userId: user.id,
        answers,
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RobotLogo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">اختبار تحديد المستوى</h1>
          <p className="text-gray-600 mt-2">دعنا نتعرف عليك بشكل أفضل</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              السؤال {currentQuestion + 1} من {ASSESSMENT_QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleAnswer(option.value)}
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <span className="mr-3 text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            السابق
          </button>

          {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
            >
              {loading ? 'جاري الإرسال...' : 'إنهاء الاختبار'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[question.id]}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
