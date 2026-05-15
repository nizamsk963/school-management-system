import { Link, useNavigate } from "react-router-dom";

function DashboardLayout({ title, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2>🎓 School ERP</h2>

        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>🏠 Home</Link>
          <Link to="#" style={styles.link}>📚 Notes</Link>
          <Link to="#" style={styles.link}>📝 Homework</Link>
          <Link to="#" style={styles.link}>📊 Reports</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1>{title}</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f7fb",
  },
  sidebar: {
    width: "250px",
    background: "#1e3a8a",
    color: "#fff",
    padding: "30px 20px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "30px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#ffffff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  logoutButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },
  content: {
    padding: "30px",
  },
};

export default DashboardLayout;