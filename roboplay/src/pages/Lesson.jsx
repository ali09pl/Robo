import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Play, Copy, RotateCcw } from 'lucide-react';
import axios from 'axios';

export const Lesson = () => {
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

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">جاري تحميل الدرس...</p>
      </div>
    );
  }

  const exercise = lesson.exercises?.[currentExercise];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="text-blue-500 hover:text-blue-600 mb-2"
            >
              ← العودة
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Lesson Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">المحتوى التعليمي</h2>
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
            </div>

            {exercise && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-800 mb-2">التمرين: {exercise.title}</h3>
                <p className="text-gray-700 mb-3">{exercise.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">
                    المكافأة: {exercise.xpReward} XP
                  </span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exercise.difficulty === 'easy' ? 'سهل' :
                     exercise.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-4">
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                <span className="font-semibold">محرر الكود</span>
                <button
                  onClick={resetCode}
                  className="text-gray-300 hover:text-white transition flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  إعادة تعيين
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-green-400 border-none focus:outline-none resize-none"
                placeholder="اكتب الكود هنا..."
                spellCheck="false"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={runCode}
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play size={18} />
                تشغيل الكود
              </button>
              <button
                onClick={submitExercise}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                إرسال الحل
              </button>
            </div>

            {/* Output */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white px-4 py-3">
                <span className="font-semibold">النتيجة</span>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm h-32 overflow-auto">
                {output || <span className="text-gray-500">لا توجد نتيجة حتى الآن</span>}
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
