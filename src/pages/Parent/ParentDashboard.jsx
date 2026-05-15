import DashboardLayout from "../../components/Layout/DashboardLayout";

function ParentDashboard() {
  const student = {
    name: "Rahul Kumar",
    className: "Class 5",
    section: "A",
    rollNo: 12,
  };

  const attendance = {
    present: 22,
    absent: 3,
  };

  const marks = [
    { subject: "Mathematics", marks: 95 },
    { subject: "Science", marks: 88 },
    { subject: "English", marks: 91 },
  ];

  const events = [
    {
      title: "Annual Day Celebration",
      date: "2026-06-10",
    },
    {
      title: "Science Exhibition",
      date: "2026-06-18",
    },
  ];

  return (
    <DashboardLayout title="👨‍👩‍👧 Parent Dashboard">
      {/* Student Details */}
      <div style={styles.section}>
        <h2>👨‍🎓 Student Details</h2>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Class:</strong> {student.className}</p>
        <p><strong>Section:</strong> {student.section}</p>
        <p><strong>Roll No:</strong> {student.rollNo}</p>
      </div>

      {/* Progress Summary */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📈 Progress Summary</h2>
        <p>Overall Performance: Excellent</p>
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

      {/* School Events */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>🎉 School Events</h2>
        <div style={styles.grid}>
          {events.map((event, index) => (
            <div key={index} style={styles.card}>
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
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

export default ParentDashboard;