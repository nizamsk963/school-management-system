import DashboardLayout from "../../components/Layout/DashboardLayout";

function StudentDashboard() {
  const notes = [
    {
      title: "Math Chapter 1",
      content: "Introduction to Numbers",
    },
    {
      title: "Science Chapter 2",
      content: "Plants and Animals",
    },
  ];

  const homeworks = [
    {
      title: "Math Worksheet",
      dueDate: "2026-05-25",
      status: "Pending",
    },
    {
      title: "Science Project",
      dueDate: "2026-05-22",
      status: "Completed",
    },
  ];

  const attendance = {
    present: 22,
    absent: 3,
  };

  const marks = [
    {
      subject: "Mathematics",
      marks: 95,
    },
    {
      subject: "Science",
      marks: 88,
    },
    {
      subject: "English",
      marks: 91,
    },
  ];

  return (
    <DashboardLayout title="👨‍🎓 Student Dashboard">
      {/* Notes */}
      <div style={styles.section}>
        <h2>📚 My Notes</h2>
        <div style={styles.grid}>
          {notes.map((note, index) => (
            <div key={index} style={styles.card}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Homework */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📝 Homework</h2>
        <div style={styles.grid}>
          {homeworks.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.title}</h3>
              <p><strong>Due Date:</strong> {item.dueDate}</p>
              <p>
                <strong>Status:</strong>{" "}
                {item.status === "Completed"
                  ? "✅ Completed"
                  : "⏳ Pending"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Summary */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📅 Attendance Summary</h2>
        <p>✅ Present Days: {attendance.present}</p>
        <p>❌ Absent Days: {attendance.absent}</p>
      </div>

      {/* Marks Report */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📊 Marks Report</h2>
        <div style={styles.grid}>
          {marks.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.subject}</h3>
              <p><strong>Marks:</strong> {item.marks}</p>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
};

export default StudentDashboard;