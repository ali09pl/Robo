const mongoose = require('mongoose');
const dotenv = require('dotenv');
const coursesData = require('./courses-data');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schemas
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  language: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  icon: { type: String, default: '📚' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  createdAt: { type: Date, default: Date.now },
});

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  order: { type: Number, required: true },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  createdAt: { type: Date, default: Date.now },
});

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

const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Seed data
async function seedDatabase() {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Exercise.deleteMany({});

    console.log('🗑️ تم مسح البيانات القديمة');

    // Create Python Course
    const pythonCourse = new Course({
      title: coursesData.python.title,
      description: coursesData.python.description,
      language: coursesData.python.language,
      level: coursesData.python.level,
      icon: coursesData.python.icon,
    });

    await pythonCourse.save();
    console.log('✅ تم إنشاء دورة Python');

    // Create Lessons and Exercises
    for (const lessonData of coursesData.python.lessons) {
      const lesson = new Lesson({
        courseId: pythonCourse._id,
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        order: lessonData.order,
      });

      await lesson.save();
      console.log(`✅ تم إنشاء الدرس: ${lessonData.title}`);

      // Create exercises for this lesson
      for (const exerciseData of lessonData.exercises) {
        const exercise = new Exercise({
          lessonId: lesson._id,
          title: exerciseData.title,
          description: exerciseData.description,
          type: exerciseData.type,
          initialCode: exerciseData.initialCode,
          expectedOutput: exerciseData.expectedOutput,
          xpReward: exerciseData.xpReward,
          difficulty: exerciseData.difficulty,
        });

        await exercise.save();
        lesson.exercises.push(exercise._id);
      }

      await lesson.save();
      pythonCourse.lessons.push(lesson._id);
    }

    await pythonCourse.save();

    console.log('\n✨ تم ملء قاعدة البيانات بنجاح!');
    console.log(`📚 تم إنشاء ${coursesData.python.lessons.length} دروس`);
    
    let totalExercises = 0;
    coursesData.python.lessons.forEach(lesson => {
      totalExercises += lesson.exercises.length;
    });
    console.log(`💪 تم إنشاء ${totalExercises} تمرين`);

    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    process.exit(1);
  }
}

seedDatabase();
