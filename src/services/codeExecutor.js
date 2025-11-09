// خدمة تنفيذ الكود باستخدام Pyodide

let pyodideReady = false;
let pyodide = null;

// تحميل Pyodide
export const initPyodide = async () => {
  if (pyodideReady) return pyodide;

  try {
    // تحميل Pyodide من CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          pyodide = await window.loadPyodide();
          pyodideReady = true;
          console.log('✅ Pyodide loaded successfully');
          resolve(pyodide);
        } catch (error) {
          console.error('❌ Error loading Pyodide:', error);
          reject(error);
        }
      };

      script.onerror = () => {
        console.error('❌ Error loading Pyodide script');
        reject(new Error('Failed to load Pyodide'));
      };

      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('❌ Error initializing Pyodide:', error);
    throw error;
  }
};

// تنفيذ كود Python
export const executePythonCode = async (code) => {
  try {
    if (!pyodideReady) {
      await initPyodide();
    }

    // إعادة تعيين stdout
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `);

    // تنفيذ الكود
    pyodide.runPython(code);

    // الحصول على النتيجة
    const output = pyodide.runPython(`
import sys
sys.stdout.getvalue()
    `);

    return {
      success: true,
      output: output || 'تم تنفيذ الكود بنجاح',
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message || 'خطأ في تنفيذ الكود',
    };
  }
};

// تنفيذ كود مع معالجة الأخطاء المتقدمة
export const executePythonCodeAdvanced = async (code) => {
  try {
    if (!pyodideReady) {
      await initPyodide();
    }

    // إعادة تعيين البيئة
    pyodide.runPython(`
import sys
from io import StringIO
import traceback

# إعادة تعيين stdout و stderr
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

    try {
      // تنفيذ الكود
      pyodide.runPython(code);

      // الحصول على النتيجة
      const output = pyodide.runPython(`sys.stdout.getvalue()`);

      return {
        success: true,
        output: output || 'تم تنفيذ الكود بنجاح',
        error: null,
      };
    } catch (executionError) {
      // الحصول على رسالة الخطأ
      const errorOutput = pyodide.runPython(`sys.stderr.getvalue()`);
      const errorMessage = executionError.message || errorOutput || 'خطأ غير معروف';

      return {
        success: false,
        output: '',
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      success: false,
      output: '',
      error: 'خطأ في تحضير بيئة التنفيذ: ' + error.message,
    };
  }
};

// تنفيذ كود مع اختبارات
export const executePythonCodeWithTests = async (code, testCases) => {
  try {
    if (!pyodideReady) {
      await initPyodide();
    }

    const results = [];

    for (const testCase of testCases) {
      // إعادة تعيين البيئة لكل اختبار
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      try {
        // تنفيذ الكود مع الإدخال
        if (testCase.input) {
          pyodide.runPython(`
import sys
sys.stdin = StringIO("""${testCase.input}""")
          `);
        }

        pyodide.runPython(code);

        // الحصول على النتيجة
        const output = pyodide.runPython(`sys.stdout.getvalue()`).trim();
        const expectedOutput = testCase.output.trim();

        results.push({
          description: testCase.description,
          input: testCase.input,
          expected: expectedOutput,
          actual: output,
          passed: output === expectedOutput,
        });
      } catch (error) {
        results.push({
          description: testCase.description,
          input: testCase.input,
          expected: testCase.output,
          actual: '',
          passed: false,
          error: error.message,
        });
      }
    }

    const allPassed = results.every(r => r.passed);

    return {
      success: allPassed,
      results: results,
      message: allPassed ? 'جميع الاختبارات نجحت! ✅' : 'بعض الاختبارات فشلت ❌',
    };
  } catch (error) {
    return {
      success: false,
      results: [],
      message: 'خطأ في تنفيذ الاختبارات: ' + error.message,
    };
  }
};
