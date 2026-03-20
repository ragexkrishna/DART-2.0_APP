import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login              from "./pages/Login";
import AdminDashboard     from "./pages/admin/AdminDashboard";
import Students           from "./pages/admin/Students";
import MarkAttendance     from "./pages/admin/MarkAttendance";
import AdminTickets       from "./pages/admin/Tickets";
import FeedbackManagement  from "./pages/admin/FeedbackManagement";
import AdminLeaderboard    from "./pages/admin/AdminLeaderboard";
import AdminProfile        from "./pages/admin/AdminProfile";
import AdminSchedule      from "./pages/admin/AdminSchedule";
import StudentDashboard   from "./pages/student/StudentDashboard";
import MyAttendance       from "./pages/student/MyAttendance";
import MyTickets          from "./pages/student/MyTickets";
import Schedule           from "./pages/student/Schedule";
import Feedback           from "./pages/student/Feedback";
import Leaderboard        from "./pages/student/Leaderboard";
import StudentProfile     from "./pages/student/StudentProfile";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import Profile            from "./pages/Profile";
import Register           from "./pages/Register";
import ProtectedRoute     from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes - protected */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute role="admin">
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/admin/attendance" element={
          <ProtectedRoute role="admin">
            <MarkAttendance />
          </ProtectedRoute>
        } />
        <Route path="/admin/tickets" element={
          <ProtectedRoute role="admin">
            <AdminTickets />
          </ProtectedRoute>
        } />
        <Route path="/admin/feedback" element={
          <ProtectedRoute role="admin">
            <FeedbackManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/leaderboard" element={
          <ProtectedRoute role="admin">
            <AdminLeaderboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin">
            <AdminProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin/schedule" element={
          <ProtectedRoute role="admin">
            <AdminSchedule />
          </ProtectedRoute>
        } />

        {/* Student routes - protected */}
        <Route path="/student" element={<Navigate to="/student/dashboard" />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/attendance" element={
          <ProtectedRoute role="student">
            <MyAttendance />
          </ProtectedRoute>
        } />
        <Route path="/student/tickets" element={
          <ProtectedRoute role="student">
            <MyTickets />
          </ProtectedRoute>
        } />
        <Route path="/student/schedule" element={
          <ProtectedRoute role="student">
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/student/feedback" element={
          <ProtectedRoute role="student">
            <Feedback />
          </ProtectedRoute>
        } />
        <Route path="/student/leaderboard" element={
          <ProtectedRoute role="student">
            <Leaderboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute role="student">
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/student/announcements" element={
          <ProtectedRoute role="student">
            <StudentAnnouncements />
          </ProtectedRoute>
        } />

        {/* Shared / legacy route */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
