import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // =========================
  // Logout Function
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    // Redirect to Home Page
    navigate("/");
  };

  // =========================
  // Role-Based Menus
  // =========================
  const menus = {
    teacher: [
      { name: "Dashboard", path: "/teacher" },
      { name: "My Classes", path: "/teacher/classes" },
      { name: "Notes", path: "/teacher/notes" },
      { name: "Homework", path: "/teacher/homework" },
      { name: "Attendance", path: "/teacher/attendance" },
      { name: "Marks", path: "/teacher/marks" },
    ],

    student: [
      { name: "Dashboard", path: "/student" },
      { name: "My Notes", path: "/student/notes" },
      { name: "Homework", path: "/student/homework" },
      { name: "Attendance", path: "/student/attendance" },
      { name: "Marks", path: "/student/marks" },
    ],

    parent: [
      { name: "Dashboard", path: "/parent" },
      { name: "Child Details", path: "/parent/child" },
      { name: "Progress", path: "/parent/progress" },
      { name: "Attendance", path: "/parent/attendance" },
      { name: "Marks", path: "/parent/marks" },
      { name: "Events", path: "/parent/events" },
    ],

    principal: [
      { name: "Dashboard", path: "/principal" },
      { name: "Teachers", path: "/principal/teachers" },
      { name: "Students", path: "/principal/students" },
      { name: "Classes", path: "/principal/classes" },
      { name: "Reports", path: "/principal/reports" },
      { name: "Announcements", path: "/principal/announcements" },
    ],
  };

  // Current Role Menu
  const currentMenu = menus[role] || [];

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <h2 style={styles.logo}>🏫 School App</h2>

      {/* Navigation Menu */}
      <ul style={styles.menu}>
        {currentMenu.map((item, index) => (
          <li key={index} style={styles.item}>
            <Link to={item.path} style={styles.link}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutButton}>
        🚪 Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#1e293b",
    color: "#ffffff",
    padding: "20px",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },

  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flex: 1,
  },

  item: {
    marginBottom: "15px",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    display: "block",
    padding: "8px 12px",
    borderRadius: "8px",
  },

  logoutButton: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Sidebar;