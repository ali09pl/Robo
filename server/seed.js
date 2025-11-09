const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
      title: 'Python للمبتدئين',
      description: 'تعلم أساسيات لغة Python من الصفر',
      language: 'Python',
      level: 'beginner',
      icon: '🐍',
    });

    await pythonCourse.save();
    console.log('✅ تم إنشاء دورة Python');

    // Create Lesson 1
    const lesson1 = new Lesson({
      courseId: pythonCourse._id,
      title: 'مقدمة في Python',
      description: 'تعريف بلغة Python وأساسياتها',
      content: `# مقدمة في Python

Python هي لغة برمجة قوية وسهلة التعلم. تُستخدم في:
- تطوير تطبيقات الويب
- الذكاء الاصطناعي والتعلم الآلي
- تحليل البيانات
- الأتمتة والبرمجة النصية

## مميزات Python:
1. سهلة التعلم والقراءة
2. مرنة وقوية
3. لديها مكتبات ضخمة
4. مفتوحة المصدر

دعنا نبدأ بأول برنامج Python!`,
      order: 1,
    });

    await lesson1.save();
    console.log('✅ تم إنشاء الدرس الأول');

    // Create Exercise 1
    const exercise1 = new Exercise({
      lessonId: lesson1._id,
      title: 'طباعة "Hello World"',
      description: 'اكتب برنامج يطبع "Hello World"',
      type: 'code',
      initialCode: `# اكتب الكود هنا
print("Hello World")`,
      expectedOutput: 'Hello World',
      xpReward: 10,
      difficulty: 'easy',
      testCases: [
        {
          input: '',
          output: 'Hello World',
          description: 'اختبار الطباعة الأساسية',
        },
      ],
    });

    await exercise1.save();
    console.log('✅ تم إنشاء التمرين الأول');

    // Add exercise to lesson
    lesson1.exercises.push(exercise1._id);
    await lesson1.save();

    // Add lesson to course
    pythonCourse.lessons.push(lesson1._id);
    await pythonCourse.save();

    // Create Lesson 2
    const lesson2 = new Lesson({
      courseId: pythonCourse._id,
      title: 'المتغيرات والأنواع',
      description: 'تعلم المتغيرات والأنواع البيانية في Python',
      content: `# المتغيرات والأنواع البيانية

## المتغيرات
المتغير هو حاوية تخزن قيمة معينة.

\`\`\`python
name = "أحمد"
age = 25
height = 1.75
is_student = True
\`\`\`

## الأنواع البيانية الأساسية:
1. **String** - نصوص: "Hello"
2. **Integer** - أعداد صحيحة: 42
3. **Float** - أعداد عشرية: 3.14
4. **Boolean** - قيم منطقية: True/False
5. **List** - قوائم: [1, 2, 3]
6. **Dictionary** - قواميس: {"name": "أحمد"}`,
      order: 2,
    });

    await lesson2.save();
    console.log('✅ تم إنشاء الدرس الثاني');

    // Create Exercise 2
    const exercise2 = new Exercise({
      lessonId: lesson2._id,
      title: 'إنشاء متغيرات',
      description: 'أنشئ متغيرات لتخزين اسمك وعمرك وطولك',
      type: 'code',
      initialCode: `# أنشئ المتغيرات هنا
name = "أحمد"
age = 25
height = 1.75

# اطبع المتغيرات
print(name)
print(age)
print(height)`,
      expectedOutput: 'أحمد\n25\n1.75',
      xpReward: 15,
      difficulty: 'easy',
    });

    await exercise2.save();
    console.log('✅ تم إنشاء التمرين الثاني');

    // Add exercise to lesson
    lesson2.exercises.push(exercise2._id);
    await lesson2.save();

    // Add lesson to course
    pythonCourse.lessons.push(lesson2._id);
    await pythonCourse.save();

    // Create C++ Course
    const cppCourse = new Course({
      title: 'C++ للمبتدئين',
      description: 'تعلم أساسيات لغة C++ من الصفر',
      language: 'C++',
      level: 'beginner',
      icon: '⚙️',
    });

    await cppCourse.save();
    console.log('✅ تم إنشاء دورة C++');

    // Create MATLAB Course
    const matlabCourse = new Course({
      title: 'MATLAB للمبتدئين',
      description: 'تعلم أساسيات MATLAB للحسابات العلمية',
      language: 'MATLAB',
      level: 'beginner',
      icon: '📊',
    });

    await matlabCourse.save();
    console.log('✅ تم إنشاء دورة MATLAB');

    console.log('\n✨ تم ملء قاعدة البيانات بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    process.exit(1);
  }
}

seedDatabase();
