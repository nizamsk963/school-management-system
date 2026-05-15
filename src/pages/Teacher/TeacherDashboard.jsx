import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";

function TeacherDashboard() {
  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  return (
    <DashboardLayout title="👨‍🏫 Teacher Dashboard">
      <div style={styles.section}>
        <h2>📚 My Classes</h2>

        <div style={styles.grid}>
          {classes.map((className, index) => (
            <Link
              key={index}
              to={`/teacher/classes/${className}`}
              style={styles.card}
            >
              <h3>{className}</h3>
              <p>Click to manage Notes, Homework and Attendance</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  section: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textDecoration: "none",
    color: "#111827",
    display: "block",
  },
};

export default TeacherDashboard;