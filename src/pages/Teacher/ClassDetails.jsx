import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";

function ClassDetails() {
  const { className } = useParams();

  // =========================
  // Notes State
  // =========================
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [notes, setNotes] = useState([
    {
      title: "Welcome Note",
      content: "This is the first sample note.",
    },
  ]);

  // =========================
  // Homework State
  // =========================
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDueDate, setHomeworkDueDate] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");

  const [homeworks, setHomeworks] = useState([
    {
      title: "Sample Homework",
      dueDate: "2026-05-20",
      description: "Complete exercises 1 to 10.",
      completed: 18,
      pending: 7,
    },
  ]);

  // =========================
  // Attendance State
  // =========================
  const [studentName, setStudentName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("Present");

  const [attendanceList, setAttendanceList] = useState([
    {
      student: "Rahul",
      status: "Present",
    },
    {
      student: "Sneha",
      status: "Absent",
    },
  ]);

  // =========================
  // Marks State
  // =========================
  const [markStudentName, setMarkStudentName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [studentMarks, setStudentMarks] = useState("");

  const [marksList, setMarksList] = useState([
    {
      student: "Rahul",
      subject: "Mathematics",
      marks: 95,
    },
    {
      student: "Sneha",
      subject: "Science",
      marks: 88,
    },
  ]);

  // =========================
  // Add Note
  // =========================
  const handleAddNote = (e) => {
    e.preventDefault();

    if (!noteTitle || !noteContent) {
      alert("Please fill all note fields");
      return;
    }

    const newNote = {
      title: noteTitle,
      content: noteContent,
    };

    setNotes([newNote, ...notes]);

    setNoteTitle("");
    setNoteContent("");
  };

  // =========================
  // Add Homework
  // =========================
  const handleAddHomework = (e) => {
    e.preventDefault();

    if (!homeworkTitle || !homeworkDueDate || !homeworkDescription) {
      alert("Please fill all homework fields");
      return;
    }

    const newHomework = {
      title: homeworkTitle,
      dueDate: homeworkDueDate,
      description: homeworkDescription,
      completed: 0,
      pending: 25,
    };

    setHomeworks([newHomework, ...homeworks]);

    setHomeworkTitle("");
    setHomeworkDueDate("");
    setHomeworkDescription("");
  };

  // =========================
  // Add Attendance
  // =========================
  const handleAddAttendance = (e) => {
    e.preventDefault();

    if (!studentName) {
      alert("Please enter student name");
      return;
    }

    const newAttendance = {
      student: studentName,
      status: attendanceStatus,
    };

    setAttendanceList([newAttendance, ...attendanceList]);

    setStudentName("");
    setAttendanceStatus("Present");
  };

  // =========================
  // Add Marks
  // =========================
  const handleAddMarks = (e) => {
    e.preventDefault();

    if (!markStudentName || !subjectName || !studentMarks) {
      alert("Please fill all marks fields");
      return;
    }

    const newMark = {
      student: markStudentName,
      subject: subjectName,
      marks: studentMarks,
    };

    setMarksList([newMark, ...marksList]);

    setMarkStudentName("");
    setSubjectName("");
    setStudentMarks("");
  };

  return (
    <DashboardLayout title={`📘 ${className}`}>
      {/* =========================
          Notes Section
      ========================= */}
      <div style={styles.section}>
        <h2>📚 Add Notes</h2>

        <form onSubmit={handleAddNote} style={styles.form}>
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Write note content..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows="4"
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Add Note
          </button>
        </form>

        <div style={styles.grid}>
          {notes.map((note, index) => (
            <div key={index} style={styles.card}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Homework Section
      ========================= */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📝 Add Homework</h2>

        <form onSubmit={handleAddHomework} style={styles.form}>
          <input
            type="text"
            placeholder="Homework Title"
            value={homeworkTitle}
            onChange={(e) => setHomeworkTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={homeworkDueDate}
            onChange={(e) => setHomeworkDueDate(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Homework Description"
            value={homeworkDescription}
            onChange={(e) => setHomeworkDescription(e.target.value)}
            rows="4"
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Add Homework
          </button>
        </form>

        <div style={styles.grid}>
          {homeworks.map((homework, index) => (
            <div key={index} style={styles.card}>
              <h3>{homework.title}</h3>

              <p>
                <strong>Due Date:</strong> {homework.dueDate}
              </p>

              <p>{homework.description}</p>

              <p>✅ Completed Students: {homework.completed}</p>
              <p>⏳ Pending Students: {homework.pending}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Attendance Section
      ========================= */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📅 Attendance</h2>

        <form onSubmit={handleAddAttendance} style={styles.form}>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={styles.input}
          />

          <select
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
            style={styles.input}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button type="submit" style={styles.button}>
            Add Attendance
          </button>
        </form>

        <div style={styles.grid}>
          {attendanceList.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.student}</h3>
              <p>
                Status:{" "}
                {item.status === "Present"
                  ? "✅ Present"
                  : "❌ Absent"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Marks Section
      ========================= */}
      <div style={{ ...styles.section, marginTop: "40px" }}>
        <h2>📊 Marks Entry</h2>

        <form onSubmit={handleAddMarks} style={styles.form}>
          <input
            type="text"
            placeholder="Student Name"
            value={markStudentName}
            onChange={(e) => setMarkStudentName(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Marks"
            value={studentMarks}
            onChange={(e) => setStudentMarks(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Add Marks
          </button>
        </form>

        <div style={styles.grid}>
          {marksList.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.student}</h3>
              <p>
                <strong>Subject:</strong> {item.subject}
              </p>
              <p>
                <strong>Marks:</strong> {item.marks}
              </p>
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
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

export default ClassDetails;