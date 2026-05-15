import DashboardLayout from "../../components/Layout/DashboardLayout";

function PrincipalDashboard() {
  const stats = {
    teachers: 25,
    students: 620,
    classes: 20,
    attendanceRate: "96%",
  };

  const announcements = [
    {
      title: "Monthly Staff Meeting",
      date: "2026-05-20",
    },
    {
      title: "Annual Day Preparation",
      date: "2026-06-10",
    },
  ];

  return (
    <DashboardLayout title="👑 Principal Dashboard">
      {/* Summary Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>👨‍🏫 Teachers</h2>
          <p>{stats.teachers}</p>
        </div>

        <div style={styles.card}>
          <h2>👨‍🎓 Students</h2>
          <p>{stats.students}</p>
        </div>

        <div style={styles.card}>
          <h2>🏫 Classes</h2>
          <p>{stats.classes}</p>
        </div>

        <div style={styles.card}>
          <h2>📅 Attendance Rate</h2>
          <p>{stats.attendanceRate}</p>
        </div>
      </div>

      {/* Announcements */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📢 Announcements</h2>

        <div style={styles.grid}>
          {announcements.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.title}</h3>
              <p><strong>Date:</strong> {item.date}</p>
            </div>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
};

export default PrincipalDashboard;