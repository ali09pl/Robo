import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotLogo } from '../components/RobotLogo';
import { useAppStore } from '../store';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'هل لديك خبرة سابقة في البرمجة؟',
    emoji: '💻',
    options: [
      { value: 'none', label: 'لا، أنا مبتدئ تماماً', icon: '🌱' },
      { value: 'basic', label: 'نعم، لدي خبرة أساسية', icon: '🌿' },
      { value: 'intermediate', label: 'لدي خبرة متوسطة', icon: '🌳' },
      { value: 'advanced', label: 'لدي خبرة متقدمة', icon: '🏔️' },
    ],
  },
  {
    id: 2,
    question: 'أي لغة برمجة تفضل؟',
    emoji: '🐍',
    options: [
      { value: 'python', label: 'Python', icon: '🐍' },
      { value: 'cpp', label: 'C++', icon: '⚙️' },
      { value: 'matlab', label: 'MATLAB', icon: '📊' },
      { value: 'other', label: 'أخرى', icon: '❓' },
    ],
  },
  {
    id: 3,
    question: 'ما هو هدفك الرئيسي من هذه المنصة؟',
    emoji: '🎯',
    options: [
      { value: 'learn_basics', label: 'تعلم أساسيات البرمجة', icon: '📚' },
      { value: 'ai_ml', label: 'تعلم الذكاء الاصطناعي والتعلم الآلي', icon: '🤖' },
      { value: 'robotics', label: 'تعلم الروبوتات', icon: '🦾' },
      { value: 'computer_vision', label: 'تعلم الرؤية الحاسوبية', icon: '👁️' },
    ],
  },
  {
    id: 4,
    question: 'كم ساعة يومياً يمكنك تخصيصها للتعلم؟',
    emoji: '⏰',
    options: [
      { value: 'less_1', label: 'أقل من ساعة', icon: '⏱️' },
      { value: '1_2', label: '1-2 ساعة', icon: '⏲️' },
      { value: '2_3', label: '2-3 ساعات', icon: '⏳' },
      { value: 'more_3', label: 'أكثر من 3 ساعات', icon: '🕐' },
    ],
  },
  {
    id: 5,
    question: 'هل تفضل التعلم من خلال المشاريع العملية؟',
    emoji: '🛠️',
    options: [
      { value: 'yes', label: 'نعم، بالتأكيد', icon: '✅' },
      { value: 'maybe', label: 'ربما', icon: '🤔' },
      { value: 'no', label: 'لا، أفضل النظرية', icon: '📖' },
    ],
  },
];

export const AssessmentEnhanced = () => {
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
  const isAnswered = !!answers[question.id];
  const isLastQuestion = currentQuestion === ASSESSMENT_QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <RobotLogo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">اختبار تحديد المستوى</h1>
          <p className="text-gray-600 mt-2">دعنا نتعرف عليك بشكل أفضل لتخصيص تجربتك التعليمية</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              السؤال {currentQuestion + 1} من {ASSESSMENT_QUESTIONS.length}
            </span>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-in-right">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{question.emoji}</span>
            <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[question.id] === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleAnswer(option.value)}
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <span className="text-2xl mr-3">{option.icon}</span>
                <span className="text-gray-700 font-medium flex-1">{option.label}</span>
                {answers[question.id] === option.value && (
                  <CheckCircle size={20} className="text-blue-500" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={20} />
            السابق
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !isAnswered}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  إنهاء الاختبار
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
            >
              التالي
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Question Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {ASSESSMENT_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentQuestion
                  ? 'w-8 bg-blue-500'
                  : index < currentQuestion
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
