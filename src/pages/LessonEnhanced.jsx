import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Play, Copy, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export const LessonEnhanced = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserXP } = useAppStore();
  
  const [lesson, setLesson] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`/api/lessons/${lessonId}`);
      setLesson(response.data);
      if (response.data.exercises?.length > 0) {
        setCode(response.data.exercises[0].initialCode || '');
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError('خطأ في تحميل الدرس');
    }
  };

  const runCode = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setSuccess('');

    try {
      const response = await axios.post('/api/exercises/run', {
        code,
        language: lesson.language || 'python',
      });

      setOutput(response.data.output);
      
      if (response.data.success) {
        setSuccess('✅ تم تنفيذ الكود بنجاح!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تنفيذ الكود');
    } finally {
      setLoading(false);
    }
  };

  const submitExercise = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/exercises/submit', {
        exerciseId: lesson.exercises[currentExercise].id,
        code,
        userId: user.id,
      });

      if (response.data.success) {
        setSuccess(`✅ ممتاز! حصلت على ${response.data.xpEarned} نقطة XP`);
        updateUserXP(response.data.xpEarned);
        
        // Move to next exercise
        if (currentExercise < lesson.exercises.length - 1) {
          setTimeout(() => {
            setCurrentExercise(prev => prev + 1);
            setCode(lesson.exercises[currentExercise + 1].initialCode || '');
            setSuccess('');
            setShowHint(false);
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في إرسال التمرين');
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    if (lesson?.exercises[currentExercise]) {
      setCode(lesson.exercises[currentExercise].initialCode || '');
      setOutput('');
      setError('');
      setSuccess('');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert('تم نسخ الكود!');
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الدرس...</p>
        </div>
      </div>
    );
  }

  const exercise = lesson.exercises?.[currentExercise];
  const progress = ((currentExercise + 1) / lesson.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="text-blue-500 hover:text-blue-600 mb-2 flex items-center gap-1"
            >
              ← العودة
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">التمرين {currentExercise + 1} من {lesson.exercises.length}</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Lesson Content */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📚 المحتوى التعليمي</h2>
            <div className="prose prose-sm max-w-none mb-6 text-gray-700 max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap text-sm">{lesson.content}</p>
            </div>

            {exercise && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">💪 التمرين الحالي</h3>
                <p className="text-gray-700 text-sm mb-3">{exercise.title}</p>
                <p className="text-gray-600 text-xs mb-3">{exercise.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {exercise.xpReward} XP
                  </span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exercise.difficulty === 'easy' ? '🌱 سهل' :
                     exercise.difficulty === 'medium' ? '🌿 متوسط' : '🏔️ صعب'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 flex justify-between items-center">
                <span className="font-semibold">💻 محرر الكود</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm"
                    title="نسخ الكود"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={resetCode}
                    className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm"
                    title="إعادة تعيين"
                  >
                    <RotateCcw size={16} />
                    إعادة
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-green-400 border-none focus:outline-none resize-none"
                placeholder="اكتب الكود هنا..."
                spellCheck="false"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={runCode}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                <Play size={18} />
                تشغيل الكود
              </button>
              <button
                onClick={submitExercise}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                <CheckCircle size={18} />
                إرسال الحل
              </button>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white px-4 py-3 font-semibold">
                📤 النتيجة
              </div>
              <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm h-40 overflow-auto">
                {output || <span className="text-gray-500">لا توجد نتيجة حتى الآن</span>}
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">خطأ</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">نجاح</p>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentExercise(prev => Math.max(0, prev - 1));
                  if (currentExercise > 0) {
                    setCode(lesson.exercises[currentExercise - 1].initialCode || '');
                    setOutput('');
                    setError('');
                    setSuccess('');
                  }
                }}
                disabled={currentExercise === 0}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                التمرين السابق
              </button>
              <button
                onClick={() => {
                  if (currentExercise < lesson.exercises.length - 1) {
                    setCurrentExercise(prev => prev + 1);
                    setCode(lesson.exercises[currentExercise + 1].initialCode || '');
                    setOutput('');
                    setError('');
                    setSuccess('');
                  }
                }}
                disabled={currentExercise === lesson.exercises.length - 1}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                التمرين التالي
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
