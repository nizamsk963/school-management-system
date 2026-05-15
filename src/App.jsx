import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// Home Page
// =========================
import Home from "./pages/Home";

// =========================
// Login Pages
// =========================
import TeacherLogin from "./pages/Login/TeacherLogin";
import StudentLogin from "./pages/Login/StudentLogin";
import ParentLogin from "./pages/Login/ParentLogin";
import PrincipalLogin from "./pages/Login/PrincipalLogin";

// =========================
// Dashboard Pages
// =========================
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import PrincipalDashboard from "./pages/Principal/PrincipalDashboard";

// =========================
// Teacher Pages
// =========================
import ClassDetails from "./pages/Teacher/ClassDetails";

// =========================
// Protected Route
// =========================
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            Home Route
        ========================= */}
        <Route path="/" element={<Home />} />

        {/* =========================
            Login Routes
        ========================= */}
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/parent-login" element={<ParentLogin />} />
        <Route path="/principal-login" element={<PrincipalLogin />} />

        {/* =========================
            Teacher Dashboard
        ========================= */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute
              allowedRole="teacher"
              loginPath="/teacher-login"
            >
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Teacher Class Details
            Example:
            /teacher/classes/Class 1
            /teacher/classes/Class 2
        ========================= */}
        <Route
          path="/teacher/classes/:className"
          element={
            <ProtectedRoute
              allowedRole="teacher"
              loginPath="/teacher-login"
            >
              <ClassDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Student Dashboard
        ========================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute
              allowedRole="student"
              loginPath="/student-login"
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Parent Dashboard
        ========================= */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute
              allowedRole="parent"
              loginPath="/parent-login"
            >
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Principal Dashboard
        ========================= */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute
              allowedRole="principal"
              loginPath="/principal-login"
            >
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;