import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏫 School Management System</h1>
        <p style={styles.subtitle}>Select your login type</p>

        <Link to="/teacher-login" style={styles.button}>
          👨‍🏫 Teacher Login
        </Link>

        <Link to="/student-login" style={styles.button}>
          👨‍🎓 Student Login
        </Link>

        <Link to="/parent-login" style={styles.button}>
          👨‍👩‍👧 Parent Login
        </Link>

        <Link to="/principal-login" style={styles.button}>
          👑 Principal Login
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginBottom: "10px",
    color: "#6b7280",
    fontSize: "16px",
  },

  button: {
    display: "block",
    padding: "14px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
  },
};

export default Home;