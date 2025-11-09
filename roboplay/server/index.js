const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  hearts: { type: Number, default: 5 },
  totalXP: { type: Number, default: 0 },
  assessmentLevel: { type: String, default: 'beginner' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  language: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  icon: { type: String, default: '📚' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  order: { type: Number, required: true },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  createdAt: { type: Date, default: Date.now },
});

const Lesson = mongoose.model('Lesson', lessonSchema);

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['code', 'quiz', 'project'], default: 'code' },
  initialCode: { type: String, default: '' },
  expectedOutput: { type: String },
  xpReward: { type: Number, default: 10 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  testCases: [{
    input: String,
    output: String,
    description: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// User Progress Schema
const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        streak: user.streak,
        xp: user.xp,
        hearts: user.hearts,
        totalXP: user.totalXP,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'خطأ في إنشاء الحساب' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'بيانات دخول غير صحيحة' });
    }

    // Check password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'بيانات دخول غير صحيحة' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        streak: user.streak,
        xp: user.xp,
        hearts: user.hearts,
        totalXP: user.totalXP,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطأ في تسجيل الدخول' });
  }
});

// Assessment Route
app.post('/api/assessment/submit', async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Determine level based on answers
    let level = 'beginner';
    const experience = answers[1]; // Question 1 about experience
    
    if (experience === 'advanced') {
      level = 'advanced';
    } else if (experience === 'intermediate') {
      level = 'intermediate';
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { assessmentLevel: level },
      { new: true }
    );

    res.json({
      message: 'تم إرسال الاختبار بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        streak: user.streak,
        xp: user.xp,
        hearts: user.hearts,
        totalXP: user.totalXP,
      },
    });
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ message: 'خطأ في معالجة الاختبار' });
  }
});

// Courses Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('lessons');
    res.json(courses);
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ message: 'خطأ في جلب الدورات' });
  }
});

// Lessons Routes
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('exercises');
    if (!lesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }
    res.json(lesson);
  } catch (error) {
    console.error('Lesson error:', error);
    res.status(500).json({ message: 'خطأ في جلب الدرس' });
  }
});

// Code Execution Routes
app.post('/api/exercises/run', async (req, res) => {
  try {
    const { code, language } = req.body;

    // Simple code execution (in production, use a sandboxed environment)
    if (language === 'python') {
      // For now, just return a mock response
      res.json({
        output: 'تم تنفيذ الكود بنجاح\nالنتيجة: Hello World',
        success: true,
      });
    } else {
      res.status(400).json({ error: 'لغة البرمجة غير مدعومة' });
    }
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'خطأ في تنفيذ الكود' });
  }
});

app.post('/api/exercises/submit', async (req, res) => {
  try {
    const { exerciseId, code, userId } = req.body;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'التمرين غير موجود' });
    }

    // Update user progress
    const progress = await UserProgress.findOneAndUpdate(
      { userId, lessonId: exercise.lessonId },
      {
        completed: true,
        xpEarned: exercise.xpReward,
        attemptCount: (await UserProgress.findOne({ userId, lessonId: exercise.lessonId }))?.attemptCount + 1 || 1,
        completedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    // Update user XP
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { xp: exercise.xpReward, totalXP: exercise.xpReward },
      },
      { new: true }
    );

    res.json({
      success: true,
      xpEarned: exercise.xpReward,
      message: 'تم إرسال التمرين بنجاح',
    });
  } catch (error) {
    console.error('Submit exercise error:', error);
    res.status(500).json({ error: 'خطأ في إرسال التمرين' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'الخادم يعمل بشكل صحيح' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
