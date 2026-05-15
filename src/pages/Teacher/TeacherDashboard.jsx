import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";

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

function TeacherDashboard() {
  return (
    <DashboardLayout title="👨‍🏫 Teacher Dashboard">
      <h2>My Classes</h2>

      <div style={styles.grid}>
        {classes.map((item, index) => (
          <Link
            key={index}
            to={`/teacher/${encodeURIComponent(item)}`}
            style={styles.link}
          >
            <div style={styles.card}>
              <h3>{item}</h3>
              <p>Notes, Homework, Attendance, and Marks</p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    cursor: "pointer",
  },
};

export default TeacherDashboard;