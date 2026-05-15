import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import PrincipalDashboard from "./pages/Principal/PrincipalDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ClassDetails from "./pages/Teacher/ClassDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<PrincipalDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/:className" element={<ClassDetails />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;