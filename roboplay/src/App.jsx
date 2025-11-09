import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { AuthEnhanced as Auth } from './pages/AuthEnhanced';
import { AssessmentEnhanced as Assessment } from './pages/AssessmentEnhanced';
import { DashboardEnhanced as Dashboard } from './pages/DashboardEnhanced';
import { LessonEnhanced as Lesson } from './pages/LessonEnhanced';
import { Stats } from './pages/Stats';
import './index.css';

function App() {
  const { isAuthenticated } = useAppStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
        {isAuthenticated && (
          <>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/course/:courseId" element={<Dashboard />} />
            <Route path="/lesson/:courseId/:lessonId" element={<Lesson />} />
          </>
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
