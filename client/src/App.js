import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './App.css';

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Na0i5J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0J0';

const roles = [
  'Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant', 'Staff'
];

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return role;
  const trimmed = role.trim().toLowerCase();
  return roles.find(r => r.toLowerCase() === trimmed) || role;
};

const roleOptions = {
  'Super Admin': [
    { label: 'Create Schools', action: 'renderCreateSchools' },
    { label: 'Create Principals', action: 'renderCreatePrincipals' },
    { label: 'Manage Subscriptions', action: 'renderManageSubscriptions' },
    { label: 'View Total Students', action: 'renderViewTotalStudents' },
    { label: 'View Total Teachers', action: 'renderViewTotalTeachers' },
    { label: 'View Revenue Reports', action: 'renderViewRevenueReports' },
    { label: 'System Settings', action: 'renderSystemSettings' },
    { label: 'Backup & Restore', action: 'renderBackupRestore' },
    { label: 'Audit Logs', action: 'renderAuditLogs' }
  ],
  'Principal': [
    { label: 'Create Admins', action: 'renderCreateAdmins' },
    { label: 'Create Accountants', action: 'renderCreateAccountants' },
    { label: 'Create Vice Principals', action: 'renderCreateVicePrincipals' },
    { label: 'Approve Admissions', action: 'renderApproveAdmissions' },
    { label: 'Generate Reports', action: 'renderGenerateReports' },
    { label: 'Send Announcements', action: 'renderSendAnnouncements' },
    { label: 'Approve Leave Requests', action: 'renderApproveLeaveRequests' }
  ],
  'Vice Principal': [
    { label: 'Monitor Attendance', action: 'renderMonitorAttendance' },
    { label: 'Check Teacher Performance', action: 'renderCheckTeacherPerformance' },
    { label: 'Handle Discipline Cases', action: 'renderHandleDisciplineCases' },
    { label: 'Create Teachers', action: 'renderCreateTeachers' },
    { label: 'Create Students', action: 'renderCreateStudents' },
    { label: 'Create Parents', action: 'renderCreateParents' },
    { label: 'Schedule Exams', action: 'renderScheduleExams' },
    { label: 'Review Academic Reports', action: 'renderReviewAcademicReports' }
  ],
  'Admin': [
    { label: 'Manage Students', action: 'renderStudentRecords' },
    { label: 'Manage Teachers', action: 'renderManageTeachers' },
    { label: 'Manage Parents', action: 'renderManageParents' },
    { label: 'Manage Staff Members', action: 'renderManageStaffMembers' },
    { label: 'Create Students', action: 'renderCreateStudents' },
    { label: 'Create Teachers', action: 'renderCreateTeachers' },
    { label: 'Create Parents', action: 'renderCreateParents' },
    { label: 'Create Staff Members', action: 'renderCreateStaffMembers' },
    { label: 'Register Students', action: 'renderRegisterStudents' },
    { label: 'Transport Management', action: 'renderTransportManagement' },
    { label: 'Hostel Management', action: 'renderHostelManagement' },
    { label: 'Inventory Management', action: 'renderInventoryManagement' },
    { label: 'Certificate Generation', action: 'renderCertificateGeneration' }
  ],
  'Teacher': [
    { label: 'Mark Attendance', action: 'renderMarkAttendance' },
    { label: 'Enter Marks', action: 'renderEnterMarks' },
    { label: 'Upload Assignments', action: 'renderUploadAssignments' },
    { label: 'Create Exams', action: 'renderCreateExams' },
    { label: 'Communicate with Parents', action: 'renderCommunicateWithParents' },
    { label: 'Track Student Progress', action: 'renderTrackStudentProgress' }
  ],
  'Student': [
    { label: 'View Attendance', action: 'renderViewStudentAttendance' },
    { label: 'View Marks', action: 'renderViewStudentMarks' },
    { label: 'View Timetable', action: 'renderViewStudentTimetable' },
    { label: 'Download Study Materials', action: 'renderDownloadMaterials' },
    { label: 'Submit Assignments', action: 'renderSubmitAssignments' },
    { label: 'Pay Fees', action: 'renderPayStudentFees' },
    { label: 'View Notifications', action: 'renderViewStudentNotifications' }
  ],
  'Parent': [
    { label: 'Monitor Child Progress', action: 'renderMonitorChildProgress' },
    { label: 'View Attendance', action: 'renderViewChildAttendance' },
    { label: 'Pay Fees', action: 'renderPayChildFees' },
    { label: 'Chat with Teachers', action: 'renderChatWithTeachers' },
    { label: 'Download Report Cards', action: 'renderDownloadReportCards' }
  ],
  'Accountant': [
    { label: 'Manage Students', action: 'renderStudentRecords' },
    { label: 'Manage Teachers', action: 'renderManageTeachers' },
    { label: 'Manage Parents', action: 'renderManageParents' },
    { label: 'Manage Staff Members', action: 'renderManageStaffMembers' },
    { label: 'Create Students', action: 'renderCreateStudents' },
    { label: 'Create Teachers', action: 'renderCreateTeachers' },
    { label: 'Create Parents', action: 'renderCreateParents' },
    { label: 'Create Staff Members', action: 'renderCreateStaffMembers' },
    { label: 'Fee Collection', action: 'renderFeeCollection' },
    { label: 'Salary Management', action: 'renderSalaryManagement' },
    { label: 'Expense Tracking', action: 'renderExpenseTracking' },
    { label: 'Financial Reports', action: 'renderFinancialReports' },
    { label: 'Tax Reports', action: 'renderTaxReports' }
  ],
  'Staff': [
    { label: 'View Assignments', action: 'renderViewStaffAssignments' },
    { label: 'Update Status', action: 'renderUpdateStaffStatus' },
    { label: 'Manage Campus Tasks', action: 'renderManageCampusTasks' },
    { label: 'Communicate with Admin', action: 'renderStaffCommunications' }
  ]
};

const getPanelHeroImage = (title) => {
  if (/school|school profile|principal|admin/i.test(title)) {
    return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
  }
  if (/student|attendance|marks|report|timetable|assignments|homework/i.test(title)) {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
  }
  if (/teacher|class|performance|discipline|exams|communicate/i.test(title)) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
  }
  if (/finance|expense|salary|fee|tax/i.test(title)) {
    return 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
};

const publicPages = [
  { key: 'Home', label: 'Home' },
  { key: 'About', label: 'About School' },
  { key: 'Admissions', label: 'Admissions' },
  { key: 'Academics', label: 'Academics' },
  { key: 'Gallery', label: 'Gallery' },
  { key: 'Announcements', label: 'Announcements' },
  { key: 'Contact', label: 'Contact Us' },
  { key: 'Login', label: 'Login' }
];

const loginRoleSummaries = [
  { role: 'Super Admin', description: 'Manage schools, principals, global settings, and core system access.' },
  { role: 'Principal', description: 'Oversee academic workflows, approve admissions, and manage school staff.' },
  { role: 'Vice Principal', description: 'Supervise discipline, exams, and teacher assignments with authority.' },
  { role: 'Admin', description: 'Handle student records, teacher registrations, staff operations, and campus services.' },
  { role: 'Teacher', description: 'Track classes, attendance, grades, and communicate with students and parents.' },
  { role: 'Student', description: 'View marks, attendance, timetable, resources, and personal academic progress.' },
  { role: 'Parent', description: 'Monitor child activity, fee status, and communicate directly with teachers.' },
  { role: 'Accountant', description: 'Manage finance, collections, student/teacher access, and parent account support.' },
  { role: 'Staff', description: 'Support campus operations and access their staff dashboard for daily tasks.' }
];

const loginRoles = loginRoleSummaries.map(item => item.role);

const roleIcons = {
  'Super Admin': '🛡️',
  'Principal': '🎓',
  'Vice Principal': '🏫',
  'Admin': '🧑‍💼',
  'Teacher': '🍎',
  'Student': '🎒',
  'Parent': '👪',
  'Accountant': '📊',
  'Staff': '🧑‍🔧'
};

const getRoleIcon = (role) => roleIcons[role] || '🔐';

function HomePage({ state, openLoginPage, openSuperAdminSignup }) {
  return (
    <div className="public-page home-page">
      <section className="hero-section hero-section-rich">
        <div className="hero-copy">
          <span className="eyebrow">Welcome to Evergreen School ERP</span>
          <h2>Modern school management designed for leadership, teachers, parents, and students.</h2>
          <p>Access a premium enterprise portal with dedicated dashboards, admissions, finance, academics and communication tools for every role.</p>
          <div className="hero-actions">
            <button className="primary-button hero-cta" onClick={() => openLoginPage()}>Login to ERP Portal</button>
            <button className="secondary-button hero-cta" onClick={openSuperAdminSignup}>Super Admin Signup</button>
          </div>
          <div className="hero-quickstats">
            <div>
              <span>1,240+</span>
              <p>Active learners</p>
            </div>
            <div>
              <span>98+</span>
              <p>Experienced staff</p>
            </div>
            <div>
              <span>45</span>
              <p>Active programs</p>
            </div>
          </div>
        </div>
        <div className="hero-visual hero-visual-school">
          <div className="hero-visual-overlay" />
        </div>
      </section>
      <section className="role-login-collection">
        <div className="section-header">
          <span className="eyebrow">Role-based access</span>
          <h3>Choose your secure School ERP portal</h3>
          <p>Each role has a dedicated, visually designed login option for a polished and secure experience.</p>
        </div>
        <div className="role-login-grid premium-grid">
          {loginRoles.map(role => (
            <button
              key={role}
              type="button"
              className={`role-login-card role-login-card-${role.replace(/\s+/g, '-')}`}
              onClick={() => openLoginPage(role)}
            >
              <div className="role-login-card-icon">{getRoleIcon(role)}</div>
              <div className="role-login-card-content">
                <div className="role-login-card-title">{role}</div>
                <div className="role-login-card-subtitle">Use your registered {role} credentials to sign in.</div>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="feature-grid">
        <div className="feature-card"><h3>Academic Excellence</h3><p>Manage subjects, time tables, exams, marks and progress analytics.</p></div>
        <div className="feature-card"><h3>Admissions</h3><p>Streamline admission approvals, interviews, enquiries and enrollment workflows.</p></div>
        <div className="feature-card"><h3>Finance</h3><p>Track fees, payments, accounting and reports for all students and staff.</p></div>
        <div className="feature-card"><h3>Campus Life</h3><p>Handle transport, library, hostels, events and announcements from one dashboard.</p></div>
      </section>
      <section className="stats-grid">
        <div className="stat-card"><div>1,240+</div><div>Students Enrolled</div></div>
        <div className="stat-card"><div>98+</div><div>Experienced Teachers</div></div>
        <div className="stat-card"><div>45</div><div>Active Courses</div></div>
        <div className="stat-card"><div>22</div><div>Annual Events</div></div>
      </section>
    </div>
  );
}

// FIX: Added 'onCancel' to destructured props parameters below
function RoleLoginPage({ onSubmit, authError, onCancel, selectedRole }) {
  return (
    <div className="public-page login-page">
      <section className="page-section login-panel">
        <div className="panel-header">
          <div>
            <h2>ERP Portal Login</h2>
            <p>Sign in with your registered email or assigned login ID. Your role will be identified automatically.</p>
            {selectedRole && <p className="role-hint">Selected role: <strong>{selectedRole}</strong></p>}
          </div>
          <button className="secondary-button" type="button" onClick={onCancel}>
            Back to Home
          </button>
        </div>

        <form className="grid-form" onSubmit={onSubmit}>
          <label>
            Login ID or Email
            <input name="loginEmail" type="text" required placeholder="Email or Login ID" />
          </label>
          <label>
            Password
            <input name="loginPassword" type="password" required placeholder="Your password" />
          </label>
          <div className="field-note">If no email login works, use your assigned login ID and the password provided by your administrator.</div>
          <div className="form-actions">
            <button type="submit">Login</button>
          </div>
        </form>
        <div className="login-tip">
          Use your registered email or login ID. Student/Parent users can login using their assigned ID values.
        </div>
        {authError && <div className="error-text">{authError}</div>}
      </section>
    </div>
  );
}

// FIX: Added 'onCancel' to destructured props parameters below
function SuperAdminSignupPage({ onSubmit, authError, onCancel }) {
  return (
    <div className="public-page signup-page">
      <section className="page-section login-panel">
        <div className="panel-header">
          <div>
            <h2>Super Admin Signup</h2>
            <p>Create the initial Super Admin account to manage the ERP system.</p>
          </div>
          <button className="secondary-button" type="button" onClick={onCancel}>
            Back to Home
          </button>
        </div>

        <form className="grid-form" onSubmit={onSubmit}>
          <label>
            Full Name
            <input name="signupName" type="text" required placeholder="Your full name" />
          </label>
          <label>
            Email
            <input name="signupEmail" type="email" required placeholder="admin@school.edu" />
          </label>
          <label>
            Password
            <input name="signupPassword" type="password" required placeholder="Create a secure password" />
          </label>
          <div className="field-note">This Super Admin account will be created with privileged ERP access.</div>
          <div className="form-actions">
            <button type="submit">Create Super Admin</button>
          </div>
        </form>
        {authError && <div className="error-text">{authError}</div>}
      </section>
    </div>
  );
}

function AboutSchool() {
  return (
    <div className="public-page">
      <section className="page-section">
        <h2>About Our School</h2>
        <p>Evergreen School ERP is built for modern educational institutions that demand powerful administration, user-friendly interfaces, and role-specific dashboards. Every module is crafted to help Super Admins, Principals, Teachers, Parents and Students collaborate efficiently.</p>
      </section>
      <section className="page-section split-section">
        <div>
          <h3>Our Mission</h3>
          <p>To provide every student with a safe, nurturing learning environment supported by intuitive school operations and robust analytics.</p>
        </div>
        <div>
          <h3>Our Vision</h3>
          <p>To become the trusted ERP partner for schools looking to bridge administration, teaching, student life, and parent communication.</p>
        </div>
      </section>
    </div>
  );
}

function AdmissionsPage({ state }) {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    section: '',
    dateOfBirth: '',
    parentName: '',
    parentContact: '',
    parentEmail: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAdmission = async (event) => {
    event.preventDefault();
    setSubmissionStatus('Submitting application...');

    try {
      await axios.post('/api/admissions', {
        studentName: formData.studentName,
        grade: formData.grade,
        section: formData.section,
        dateOfBirth: formData.dateOfBirth,
        parentName: formData.parentName,
        parentContact: formData.parentContact,
        parentEmail: formData.parentEmail
      });
      setSubmissionStatus('Application submitted successfully. Our admissions team will review it and contact you soon.');
      setFormData({ studentName: '', grade: '', section: '', dateOfBirth: '', parentName: '', parentContact: '', parentEmail: '' });
    } catch (error) {
      console.error('Admission submission failed', error);
      setSubmissionStatus(error.response?.data?.error || 'Failed to submit application. Please try again later.');
    }
  };

  return (
    <div className="public-page">
      <section className="page-section">
        <h2>Admissions Workflow</h2>
        <p>Manage new student enquiries, application tracking, approval workflows and instant notifications for parents and admins.</p>
      </section>
      <section className="timeline-card">
        <div className="timeline-step"><h4>Step 1</h4><p>Submit admission enquiry and student details online.</p></div>
        <div className="timeline-step"><h4>Step 2</h4><p>Principal reviews application and schedules interview.</p></div>
        <div className="timeline-step"><h4>Step 3</h4><p>Admission is approved or rejected, then fee details are shared.</p></div>
        <div className="timeline-step"><h4>Step 4</h4><p>Student is enrolled, assigned a classroom, and a profile is created.</p></div>
      </section>
      <section className="page-section admission-form-section">
        <h3>Submit an Admission Request</h3>
        <p>Parent/guardian can submit the student application details and wait for the school to review the request.</p>
        <form className="grid-form" onSubmit={handleSubmitAdmission}>
          <label>
            Student Name
            <input name="studentName" required value={formData.studentName} onChange={handleFormChange} placeholder="Aarav Singh" />
          </label>
          <label>
            Grade
            <input name="grade" required value={formData.grade} onChange={handleFormChange} placeholder="5" />
          </label>
          <label>
            Section
            <input name="section" value={formData.section} onChange={handleFormChange} placeholder="A" />
          </label>
          <label>
            Date of Birth
            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleFormChange} />
          </label>
          <label>
            Parent / Guardian Name
            <input name="parentName" required value={formData.parentName} onChange={handleFormChange} placeholder="Rita Singh" />
          </label>
          <label>
            Parent Contact
            <input name="parentContact" required value={formData.parentContact} onChange={handleFormChange} placeholder="9876543210" />
          </label>
          <label>
            Parent Email
            <input name="parentEmail" type="email" value={formData.parentEmail} onChange={handleFormChange} placeholder="parent@example.com" />
          </label>
          <div className="form-actions"><button type="submit">Submit Application</button></div>
          {submissionStatus && <div className="submission-status">{submissionStatus}</div>}
        </form>
      </section>
    </div>
  );
}

function AcademicsPage() {
  return (
    <div className="public-page">
      <section className="page-section">
        <h2>Academics</h2>
        <p>Everything from class scheduling to exam planning, subject mapping and academic monitoring is built into the school ERP dashboard.</p>
      </section>
      <section className="feature-grid">
        <div className="feature-card"><h3>Course Management</h3><p>Create and manage curriculum, subjects and class groups.</p></div>
        <div className="feature-card"><h3>Exam Planning</h3><p>Schedule exams, assign rooms, and publish results with analytics.</p></div>
        <div className="feature-card"><h3>Progress Reports</h3><p>Review student grades, attendance summaries and teacher evaluations.</p></div>
        <div className="feature-card"><h3>Teacher Workloads</h3><p>Track lesson plans, assignments and subject responsibilities.</p></div>
      </section>
    </div>
  );
}

function GalleryPage() {
  return (
    <div className="public-page gallery-page">
      <section className="page-section">
        <h2>School Gallery</h2>
        <p>Explore the vibrant school environment through our academic, event and campus gallery.</p>
      </section>
      <section className="gallery-grid">
        <div className="gallery-item image-one" />
        <div className="gallery-item image-two" />
        <div className="gallery-item image-three" />
        <div className="gallery-item image-four" />
      </section>
    </div>
  );
}

function AnnouncementsPage({ state }) {
  return (
    <div className="public-page">
      <section className="page-section">
        <h2>Announcements & News</h2>
        <p>Stay up to date with academic news, admission alerts, event notices and fee reminders.</p>
      </section>
      <div className="announcement-list">
        {(state.announcements.length ? state.announcements : [{ id: 'ANN0', category: 'General', message: 'No announcements available at the moment.', time: 'Now' }]).map(item => (
          <div key={item.id} className="announcement-card">
            <div className="announcement-category">{item.category || 'General'}</div>
            <div className="announcement-message">{item.message}</div>
            <div className="announcement-time">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="public-page">
      <section className="page-section">
        <h2>Contact Us</h2>
        <p>Reach out to our admissions office, support team, or school administration for any enquiries.</p>
      </section>
      <div className="contact-grid">
        <div className="contact-card"><h3>Admissions</h3><p>Email: admissions@evergreenschool.edu</p><p>Phone: +91 98765 43210</p></div>
        <div className="contact-card"><h3>Administration</h3><p>Email: admin@evergreenschool.edu</p><p>Phone: +91 91234 56789</p></div>
        <div className="contact-card"><h3>Visit Us</h3><p>123 School Avenue, Knowledge City, 560001</p><p>Mon - Fri: 8:00 AM - 6:00 PM</p></div>
      </div>
    </div>
  );
}

function DashboardPanel({ title, subtitle, children }) {
  return (
    <div className="panel-card">
      <div className="panel-hero">
        <div className="panel-hero-copy">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="panel-content">{children}</div>
    </div>
  );
}

function DashboardPlaceholder({ actionLabel }) {
  return (
    <DashboardPanel
      title={actionLabel || 'Dashboard module'}
      subtitle="This dashboard panel is available after login."
    >
      <p>We are loading the requested dashboard content. If it still does not appear, try selecting another action from the sidebar.</p>
    </DashboardPanel>
  );
}

function SchoolManagementPanel({ state, setState }) {
  const [formState, setFormState] = useState({ name: '', location: '', board: '', licenseKey: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newSchool = {
      id: `SCH${Date.now()}`,
      name: formState.name,
      location: formState.location,
      board: formState.board,
      licenseKey: formState.licenseKey,
      status: 'Active',
      tier: 'Premium'
    };
    setState(prev => ({ ...prev, schools: [...prev.schools, newSchool] }));
    setFormState({ name: '', location: '', board: '', licenseKey: '' });
  };

  return (
    <DashboardPanel
      title="School Management"
      subtitle="Create and manage school profiles for your ERP ecosystem."
    >
      <div className="metrics-grid">
        <div className="metric-card"><div>Total schools</div><div>{state.schools.length}</div></div>
        <div className="metric-card"><div>Active schools</div><div>{state.schools.filter(s => s.status === 'Active').length}</div></div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          School Name
          <input name="name" value={formState.name} onChange={handleChange} required placeholder="Cedar Valley High School" />
        </label>
        <label>
          Location
          <input name="location" value={formState.location} onChange={handleChange} required placeholder="Sector 22" />
        </label>
        <label>
          Board
          <input name="board" value={formState.board} onChange={handleChange} required placeholder="CBSE" />
        </label>
        <label>
          License Key
          <input name="licenseKey" value={formState.licenseKey} onChange={handleChange} required placeholder="LIC-9842" />
        </label>
        <div className="form-actions"><button type="submit">Create School</button></div>
      </form>
    </DashboardPanel>
  );
}

function StudentRecordsPanel({ state }) {
  return (
    <DashboardPanel
      title="Student Records"
      subtitle="Review student profiles, attendance, marks and status."
    >
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Admission #</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {state.students.map(student => (
              <tr key={student.admissionNumber}>
                <td>{student.admissionNumber}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function RevenueReportsPanel({ state }) {
  const paid = state.financials.fees.filter(f => f.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const pending = state.financials.fees.filter(f => f.status !== 'Paid').reduce((sum, item) => sum + item.amount, 0);
  return (
    <DashboardPanel
      title="Revenue Reports"
      subtitle="View paid and pending fee revenue across the school."
    >
      <div className="metrics-grid">
        <div className="metric-card"><div>Collected revenue</div><div>₹{paid.toLocaleString()}</div></div>
        <div className="metric-card"><div>Pending revenue</div><div>₹{pending.toLocaleString()}</div></div>
      </div>
    </DashboardPanel>
  );
}

function LeaveRequestsPanel({ state, setState }) {
  const updateStatus = (id, status) => setState(prev => ({
    ...prev,
    leaveRequests: prev.leaveRequests.map(request => request.id === id ? { ...request, status } : request)
  }));

  return (
    <DashboardPanel
      title="Approve Leave Requests"
      subtitle="Review pending leave requests and update statuses instantly."
    >
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.leaveRequests.map(request => (
              <tr key={request.id}>
                <td>{request.teacher}</td>
                <td>{request.date}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  <button type="button" onClick={() => updateStatus(request.id, 'Approved')}>Approve</button>
                  <button type="button" onClick={() => updateStatus(request.id, 'Denied')}>Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function AcademicReportsPanel({ state }) {
  const subjectAverages = Object.entries(state.students.reduce((acc, student) => {
    Object.entries(student.marks).forEach(([subject, value]) => {
      acc[subject] = acc[subject] || { total: 0, count: 0 };
      acc[subject].total += value;
      acc[subject].count += 1;
    });
    return acc;
  }, {})).map(([subject, meta]) => ({
    subject,
    average: Math.round(meta.total / meta.count)
  }));

  return (
    <DashboardPanel
      title="Academic Reports"
      subtitle="Track average marks and academic performance metrics."
    >
      <div className="grid-cards">
        {subjectAverages.map(item => (
          <div className="stat-card" key={item.subject}>
            <div>{item.subject}</div>
            <div>{item.average}%</div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function TransportManagementPanel() {
  const routes = [
    { id: 'R001', route: 'North Zone', bus: 'Bus 12', driver: 'Rajesh', seats: 42 },
    { id: 'R002', route: 'East Zone', bus: 'Bus 08', driver: 'Meena', seats: 38 }
  ];

  return (
    <DashboardPanel
      title="Transport Management"
      subtitle="Manage bus routes, drivers and seating capacity."
    >
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Driver</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.route}</td>
                <td>{route.bus}</td>
                <td>{route.driver}</td>
                <td>{route.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function CreatePrincipalPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send request to server to register the Principal account
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: 'Principal',
        loginId: formData.loginId
      };
      await axios.post('/api/auth/register', payload);

      const newPrincipal = {
        id: `PRN${Date.now()}`,
        name: formData.name,
        email: formData.email,
        loginId: formData.loginId,
        role: 'Principal'
      };
      setState(prev => ({ ...prev, principals: [...(prev.principals || []), newPrincipal] }));
      setFormData({ name: '', email: '', loginId: '', password: '' });
      alert('Principal created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create principal';
      alert('Error creating principal: ' + message);
    }
  };

  return (
    <DashboardPanel
      title="Create Principals"
      subtitle="Register new Principal users for schools."
    >
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Priya Sharma" />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} required placeholder="priya@school.local" />
        </label>
        <label>
          Login ID
          <input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder="PRI100" />
        </label>
        <label>
          Password
          <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" />
        </label>
        <div className="field-note">You can optionally provide a password or the system will email credentials to the new Principal.</div>
        <div className="form-actions"><button type="submit">Create Principal</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateAdminPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Admin', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newAdmin = {
        id: `ADM${Date.now()}`,
        name: formData.name,
        email: formData.email,
        loginId: formData.loginId,
        role: 'Admin'
      };
      setState(prev => ({ ...prev, admins: [...(prev.admins || []), newAdmin] }));
      setFormData({ name: '', email: '', loginId: '', password: '' });
      alert('Admin created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create admin';
      alert('Error creating admin: ' + message);
    }
  };

  return (
    <DashboardPanel
      title="Create Admins"
      subtitle="Create new admin users for school operations."
    >
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Anita Verma" />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} required placeholder="anita@school.local" />
        </label>
        <label>
          Login ID
          <input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder="ADM100" />
        </label>
        <label>
          Password
          <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" />
        </label>
        <div className="form-actions"><button type="submit">Create Admin</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateAccountantPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Accountant', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newAccountant = {
        id: `ACC${Date.now()}`,
        name: formData.name,
        email: formData.email,
        loginId: formData.loginId,
        role: 'Accountant'
      };
      setState(prev => ({ ...prev, accountants: [...(prev.accountants || []), newAccountant] }));
      setFormData({ name: '', email: '', loginId: '', password: '' });
      alert('Accountant created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create accountant';
      alert('Error creating accountant: ' + message);
    }
  };

  return (
    <DashboardPanel
      title="Create Accountants"
      subtitle="Add accountants who can manage school finance and collections."
    >
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Suresh Kumar" />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} required placeholder="suresh@school.local" />
        </label>
        <label>
          Login ID
          <input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder="ACC100" />
        </label>
        <label>
          Password
          <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" />
        </label>
        <div className="form-actions"><button type="submit">Create Accountant</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateVicePrincipalPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Vice Principal', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newVicePrincipal = {
        id: `VP${Date.now()}`,
        name: formData.name,
        email: formData.email,
        loginId: formData.loginId,
        role: 'Vice Principal'
      };
      setState(prev => ({ ...prev, vicePrincipals: [...(prev.vicePrincipals || []), newVicePrincipal] }));
      setFormData({ name: '', email: '', loginId: '', password: '' });
      alert('Vice Principal created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create vice principal';
      alert('Error creating vice principal: ' + message);
    }
  };

  return (
    <DashboardPanel
      title="Create Vice Principals"
      subtitle="Register vice principal users for school leadership support."
    >
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Rohit Patel" />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} required placeholder="rohit@school.local" />
        </label>
        <label>
          Login ID
          <input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder="VP100" />
        </label>
        <label>
          Password
          <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" />
        </label>
        <div className="form-actions"><button type="submit">Create Vice Principal</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateTeacherPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '' });
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Teacher', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newTeacher = { employeeId: `TCH${Date.now()}`, name: formData.name, email: formData.email, loginId: formData.loginId, subjects: [] };
      setState(prev => ({ ...prev, teachers: [...(prev.teachers || []), newTeacher] }));
      setFormData({ name: '', email: '', loginId: '', password: '' });
      alert('Teacher created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create teacher';
      alert('Error creating teacher: ' + message);
    }
  };

  return (
    <DashboardPanel title="Create Teachers" subtitle="Add teaching staff to the school.">
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Full Name<input name="name" value={formData.name} onChange={handleChange} required placeholder="Ramesh Kumar" /></label>
        <label>Email<input name="email" value={formData.email} onChange={handleChange} required placeholder="ramesh@school.local" /></label>
        <label>Login ID<input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder="TCH200" /></label>
        <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" /></label>
        <div className="form-actions"><button type="submit">Create Teacher</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateStudentPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '', grade: '1', section: 'A' });
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Student', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newStudent = { admissionNumber: `STD${Date.now()}`, name: formData.name, grade: formData.grade, section: formData.section, loginId: formData.loginId };
      setState(prev => ({ ...prev, students: [...(prev.students || []), newStudent] }));
      setFormData({ name: '', email: '', loginId: '', password: '', grade: '1', section: 'A' });
      alert('Student created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create student';
      alert('Error creating student: ' + message);
    }
  };

  return (
    <DashboardPanel title="Create Students" subtitle="Register new students.">
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Full Name<input name="name" value={formData.name} onChange={handleChange} required placeholder="Ankit Gupta" /></label>
        <label>Email<input name="email" value={formData.email} onChange={handleChange} placeholder="ankit@school.local" /></label>
        <label>Login ID<input name="loginId" value={formData.loginId} onChange={handleChange} placeholder="S-1001" /></label>
        <label>Grade<input name="grade" value={formData.grade} onChange={handleChange} /></label>
        <label>Section<input name="section" value={formData.section} onChange={handleChange} /></label>
        <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" /></label>
        <div className="form-actions"><button type="submit">Create Student</button></div>
      </form>
    </DashboardPanel>
  );
}

function CreateParentPanel({ state, setState }) {
  const [formData, setFormData] = useState({ name: '', email: '', loginId: '', password: '', child: '' });
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email: formData.email, password: formData.password, role: 'Parent', loginId: formData.loginId };
      await axios.post('/api/auth/register', payload);
      const newParent = { loginId: formData.loginId || `P-${Date.now()}`, name: formData.name, email: formData.email, child: formData.child };
      setState(prev => ({ ...prev, parents: [...(prev.parents || []), newParent] }));
      setFormData({ name: '', email: '', loginId: '', password: '', child: '' });
      alert('Parent created successfully.');
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to create parent';
      alert('Error creating parent: ' + message);
    }
  };

  return (
    <DashboardPanel title="Create Parents" subtitle="Register parent/guardian accounts.">
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Full Name<input name="name" value={formData.name} onChange={handleChange} required placeholder="Rekha Singh" /></label>
        <label>Email<input name="email" value={formData.email} onChange={handleChange} placeholder="rekha@school.local" /></label>
        <label>Login ID<input name="loginId" value={formData.loginId} onChange={handleChange} placeholder="P-1001" /></label>
        <label>Child's Name<input name="child" value={formData.child} onChange={handleChange} placeholder="Child Name" /></label>
        <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a secure password" /></label>
        <div className="form-actions"><button type="submit">Create Parent</button></div>
      </form>
    </DashboardPanel>
  );
}

function MarkAttendancePanel({ state, user }) {
  const teacherStudents = state.students.slice(0, 5);
  const [attendance, setAttendance] = useState({});
  const handleAttendanceChange = (studentId, status) => { setAttendance(prev => ({ ...prev, [studentId]: status })); };
  return (
    <DashboardPanel title="Mark Attendance" subtitle={`Record attendance for your classes. Logged in as: ${user?.email || user?.name}`}>
      <div className="info-box">
        <p><strong>Students in your classes:</strong> {teacherStudents.length}</p>
      </div>
      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table>
          <thead><tr><th>Student Name</th><th>Admission #</th><th>Grade</th><th>Attendance Status</th></tr></thead>
          <tbody>
            {teacherStudents.map(s => (
              <tr key={s.admissionNumber}>
                <td>{s.name}</td><td>{s.admissionNumber}</td><td>{s.grade}</td>
                <td><select value={attendance[s.admissionNumber] || ''} onChange={(e) => handleAttendanceChange(s.admissionNumber, e.target.value)} style={{padding:'6px', borderRadius:'4px'}}>
                  <option value="">Select Status</option><option value="Present">Present</option><option value="Absent">Absent</option><option value="Late">Late</option>
                </select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-actions" style={{ marginTop: '1rem' }}><button type="button">Save Attendance</button></div>
    </DashboardPanel>
  );
}

function EnterMarksPanel({ state, user }) {
  const teacherStudents = state.students.slice(0, 5);
  const [marks, setMarks] = useState({});
  const handleMarkChange = (studentId, subject, mark) => { setMarks(prev => ({ ...prev, [`${studentId}-${subject}`]: mark })); };
  return (
    <DashboardPanel title="Enter Marks" subtitle={`Submit exam/assessment marks for your students. Logged in as: ${user?.email || user?.name}`}>
      <div className="info-box">
        <p><strong>Students:</strong> {teacherStudents.length} | <strong>Subjects:</strong> Mathematics, Science, English</p>
      </div>
      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table>
          <thead><tr><th>Student</th><th>Admission #</th><th>Math</th><th>Science</th><th>English</th></tr></thead>
          <tbody>
            {teacherStudents.map(s => (
              <tr key={s.admissionNumber}>
                <td>{s.name}</td><td>{s.admissionNumber}</td>
                <td><input type="number" min="0" max="100" value={marks[`${s.admissionNumber}-Math`] || ''} onChange={(e) => handleMarkChange(s.admissionNumber, 'Math', e.target.value)} placeholder="0" style={{width:'50px'}} /></td>
                <td><input type="number" min="0" max="100" value={marks[`${s.admissionNumber}-Science`] || ''} onChange={(e) => handleMarkChange(s.admissionNumber, 'Science', e.target.value)} placeholder="0" style={{width:'50px'}} /></td>
                <td><input type="number" min="0" max="100" value={marks[`${s.admissionNumber}-English`] || ''} onChange={(e) => handleMarkChange(s.admissionNumber, 'English', e.target.value)} placeholder="0" style={{width:'50px'}} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-actions" style={{ marginTop: '1rem' }}><button type="button">Submit Marks</button></div>
    </DashboardPanel>
  );
}

function UploadAssignmentsPanel({ state, setState, user }) {
  const [assignment, setAssignment] = useState({ title: '', subject: '', deadline: '', description: '' });
  const userAssignments = (state.assignments || []).filter(a => a.createdBy === user?.email || a.createdBy === user?.name).slice(0, 5);
  const handleChange = (e) => { const { name, value } = e.target; setAssignment(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment = { id: `ASG${Date.now()}`, ...assignment, createdBy: user?.email || user?.name };
    setState(prev => ({ ...prev, assignments: [...(prev.assignments || []), newAssignment] }));
    setAssignment({ title: '', subject: '', deadline: '', description: '' });
    alert('Assignment uploaded successfully.');
  };
  return (
    <DashboardPanel title="Upload Assignments" subtitle={`Create and distribute assignments to your students. Logged in as: ${user?.email || user?.name}`}>
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Assignment Title<input name="title" value={assignment.title} onChange={handleChange} required placeholder="Chapter 5 Practice Problems" /></label>
        <label>Subject<input name="subject" value={assignment.subject} onChange={handleChange} required placeholder="Mathematics" /></label>
        <label>Deadline<input name="deadline" type="date" value={assignment.deadline} onChange={handleChange} required /></label>
        <label>Description<textarea name="description" value={assignment.description} onChange={handleChange} placeholder="Assignment instructions and details..." style={{minHeight:'80px'}}></textarea></label>
        <div className="form-actions"><button type="submit">Upload Assignment</button></div>
      </form>
      <div className="table-card" style={{ marginTop: '1.5rem' }}>
        <h3>Your Recent Assignments ({userAssignments.length})</h3>
        <table>
          <thead><tr><th>Title</th><th>Subject</th><th>Deadline</th></tr></thead>
          <tbody>
            {userAssignments.length > 0 ? userAssignments.map(a => (
              <tr key={a.id}><td>{a.title}</td><td>{a.subject}</td><td>{a.deadline}</td></tr>
            )) : <tr><td colSpan="3">No assignments yet</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function CreateExamsPanel({ state, setState, user }) {
  const [exam, setExam] = useState({ title: '', subject: '', date: '', time: '', totalMarks: '100' });
  const handleChange = (e) => { const { name, value } = e.target; setExam(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newExam = { id: `EXM${Date.now()}`, ...exam, createdBy: user?.email || user?.name };
    setState(prev => ({ ...prev, exams: [...(prev.exams || []), newExam] }));
    setExam({ title: '', subject: '', date: '', time: '', totalMarks: '100' });
    alert('Exam scheduled successfully.');
  };
  return (
    <DashboardPanel title="Create Exams" subtitle={`Schedule exams for your classes. Logged in as: ${user?.email || user?.name}`}>
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Exam Title<input name="title" value={exam.title} onChange={handleChange} required placeholder="Midterm - Mathematics" /></label>
        <label>Subject<input name="subject" value={exam.subject} onChange={handleChange} required placeholder="Mathematics" /></label>
        <label>Exam Date<input name="date" type="date" value={exam.date} onChange={handleChange} required /></label>
        <label>Time<input name="time" type="time" value={exam.time} onChange={handleChange} required /></label>
        <label>Total Marks<input name="totalMarks" type="number" value={exam.totalMarks} onChange={handleChange} required /></label>
        <div className="form-actions"><button type="submit">Schedule Exam</button></div>
      </form>
    </DashboardPanel>
  );
}

function CommunicateWithParentsPanel({ state, setState, user }) {
  const [message, setMessage] = useState({ recipientName: '', subject: '', message: '' });
  const handleChange = (e) => { const { name, value } = e.target; setMessage(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMsg = { id: `MSG${Date.now()}`, ...message, from: user?.email || user?.name, timestamp: new Date().toLocaleString() };
    setState(prev => ({ ...prev, messages: [...(prev.messages || []), newMsg] }));
    setMessage({ recipientName: '', subject: '', message: '' });
    alert('Message sent to parent/guardian successfully.');
  };
  return (
    <DashboardPanel title="Communicate with Parents" subtitle={`Send updates and messages to parents/guardians. Logged in as: ${user?.email || user?.name}`}>
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>Parent/Guardian Name<input name="recipientName" value={message.recipientName} onChange={handleChange} required placeholder="Parent Name" /></label>
        <label>Subject<input name="subject" value={message.subject} onChange={handleChange} required placeholder="Subject of message" /></label>
        <label>Message<textarea name="message" value={message.message} onChange={handleChange} required placeholder="Type your message..." style={{minHeight:'100px'}}></textarea></label>
        <div className="form-actions"><button type="submit">Send Message</button></div>
      </form>
      <div className="info-box" style={{ marginTop: '1.5rem' }}>
        <p><strong>Communication History:</strong> {(state.messages || []).length} messages sent</p>
      </div>
    </DashboardPanel>
  );
}

function TrackStudentProgressPanel({ state, user }) {
  const studentData = state.students.slice(0, 8);
  return (
    <DashboardPanel title="Track Student Progress" subtitle={`Monitor your students' academic performance and attendance. Logged in as: ${user?.email || user?.name}`}>
      <div className="info-box">
        <p><strong>Total Students:</strong> {studentData.length} | <strong>Class Average:</strong> {studentData.length > 0 ? Math.round(studentData.reduce((acc, s) => acc + (s.attendance?.present || 0), 0) / studentData.length) : 0}% attendance</p>
      </div>
      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table>
          <thead><tr><th>Student Name</th><th>Admission #</th><th>Grade</th><th>Attendance %</th><th>Avg Score</th><th>Status</th></tr></thead>
          <tbody>
            {studentData.map(s => {
              const marks = s.marks || {};
              const avgMarks = Object.keys(marks).length > 0 ? Math.round(Object.values(marks).reduce((a, b) => a + b, 0) / Object.keys(marks).length) : 0;
              const attPercent = s.attendance?.present || 0;
              return (
                <tr key={s.admissionNumber}>
                  <td>{s.name}</td><td>{s.admissionNumber}</td><td>{s.grade}-{s.section || 'A'}</td><td>{attPercent}%</td><td>{avgMarks}</td>
                  <td>{avgMarks >= 70 && attPercent >= 75 ? '✓ Good' : '⚠ Needs Support'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function ApproveAdmissionsPanel({ state, setState }) {
  const approve = (request) => {
    setState(prev => ({
      ...prev,
      students: [
        ...prev.students,
        {
          admissionNumber: request.admissionNumber,
          name: request.name,
          grade: request.grade,
          section: request.section,
          parent: { name: request.parent, contact: 'Not provided' },
          attendance: { present: 0, absent: 0, late: 0 },
          marks: { Math: 0, Science: 0, English: 0 },
          status: 'Active'
        }
      ],
      pendingAdmissions: prev.pendingAdmissions.filter(item => item.admissionNumber !== request.admissionNumber),
      notifications: [
        { id: Date.now(), message: `[Admission approved] ${request.name} has been enrolled.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.notifications
      ]
    }));
  };

  const decline = (admissionNumber) => {
    setState(prev => ({
      ...prev,
      pendingAdmissions: prev.pendingAdmissions.filter(item => item.admissionNumber !== admissionNumber),
      notifications: [
        { id: Date.now(), message: `[Admission declined] Request ${admissionNumber} was declined.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.notifications
      ]
    }));
  };

  return (
    <DashboardPanel
      title="Approve Admissions"
      subtitle="Review pending admission requests and approve or decline them."
    >
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Admission #</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Parent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.pendingAdmissions.map(request => (
              <tr key={request.admissionNumber}>
                <td>{request.admissionNumber}</td>
                <td>{request.name}</td>
                <td>{request.grade}</td>
                <td>{request.section}</td>
                <td>{request.parent}</td>
                <td>
                  <button type="button" onClick={() => approve(request)}>Approve</button>
                  <button type="button" onClick={() => decline(request.admissionNumber)}>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state.pendingAdmissions.length === 0 && <p className="info-text">No pending admissions at the moment.</p>}
    </DashboardPanel>
  );
}

function GenerateReportsPanel({ state }) {
  const studentsByGrade = state.students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardPanel
      title="Generate Reports"
      subtitle="View academic, attendance and operational reports for your school."
    >
      <div className="metrics-grid">
        <div className="metric-card"><div>Total students</div><div>{state.students.length}</div></div>
        <div className="metric-card"><div>Total teachers</div><div>{state.teachers.length}</div></div>
        <div className="metric-card"><div>Pending admissions</div><div>{state.pendingAdmissions.length}</div></div>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(studentsByGrade).map(([grade, count]) => (
              <tr key={grade}>
                <td>{grade}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function SendAnnouncementsPanel({ state, setState }) {
  const [formData, setFormData] = useState({ category: 'General', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newAnnouncement = {
      id: `ANN${Date.now()}`,
      category: formData.category,
      message: formData.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setState(prev => ({ ...prev, announcements: [newAnnouncement, ...prev.announcements] }));
    setFormData({ category: 'General', message: '' });
  };

  return (
    <DashboardPanel
      title="Send Announcements"
      subtitle="Create announcements for students, parents and staff."
    >
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Finance">Finance</option>
            <option value="Events">Events</option>
          </select>
        </label>
        <label>
          Message
          <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Enter announcement text..." />
        </label>
        <div className="form-actions"><button type="submit">Publish Announcement</button></div>
      </form>
      <div className="announcement-list">
        {(state.announcements.length ? state.announcements : [{ id: 'ANN0', category: 'General', message: 'No announcements yet.', time: 'Now' }]).map(item => (
          <div key={item.id} className="announcement-card">
            <div className="announcement-category">{item.category}</div>
            <div className="announcement-message">{item.message}</div>
            <div className="announcement-time">{item.time}</div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function SubscriptionPanel({ state }) {
  return (
    <DashboardPanel
      title="Manage Subscriptions"
      subtitle="Review school subscription status and renewal details."
    >
      <div className="metrics-grid">
        <div className="metric-card"><div>Active Subscriptions</div><div>{state.schools.filter(s => s.status === 'Active').length}</div></div>
        <div className="metric-card"><div>Premium Tier</div><div>{state.schools.filter(s => s.tier === 'Premium').length}</div></div>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Tier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {state.schools.map(school => (
              <tr key={school.id}>
                <td>{school.name}</td>
                <td>{school.tier}</td>
                <td>{school.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function SystemSettingsPanel() {
  return (
    <DashboardPanel
      title="System Settings"
      subtitle="Manage global ERP settings and operational preferences."
    >
      <div className="grid-cards">
        <div className="stat-card"><div>Theme</div><div>Auto</div></div>
        <div className="stat-card"><div>Audit Logging</div><div>Enabled</div></div>
        <div className="stat-card"><div>Notifications</div><div>Enabled</div></div>
      </div>
      <p className="info-text">Use the admin console to adjust system-wide operational settings when supported by backend controls.</p>
    </DashboardPanel>
  );
}

function BackupRestorePanel() {
  return (
    <DashboardPanel
      title="Backup & Restore"
      subtitle="Create backups and restore from snapshots."
    >
      <div className="action-row">
        <button type="button">Create Backup</button>
        <button type="button">Restore Latest</button>
      </div>
      <p className="info-text">Backup and restore actions are simulated in this demo dashboard.</p>
    </DashboardPanel>
  );
}

function AuditLogsPanel({ state }) {
  return (
    <DashboardPanel
      title="Audit Logs"
      subtitle="Browse recent system activity and administrative events."
    >
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Action</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {state.auditLogs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

function DashboardOverviewPanel({ state }) {
  return (
    <DashboardPanel
      title="Dashboard Overview"
      subtitle="Welcome to your school management dashboard. Select an action from the sidebar to begin."
    >
      <div className="metrics-grid">
        <div className="metric-card"><div>Students</div><div>{state.students.length}</div></div>
        <div className="metric-card"><div>Schools</div><div>{state.schools.length}</div></div>
        <div className="metric-card"><div>Pending Admissions</div><div>{state.pendingAdmissions.length}</div></div>
        <div className="metric-card"><div>Notifications</div><div>{state.notifications.length}</div></div>
      </div>
    </DashboardPanel>
  );
}

function ActionPlaceholderPanel({ action }) {
  const title = actionLabelMap[action] || action;
  return (
    <DashboardPanel
      title={title}
      subtitle="This section is under development and will be available for your role soon."
    >
      <p>If the button is correct but the section is not implemented yet, this placeholder confirms the action was received successfully.</p>
      <p>Please click another dashboard action while the feature is being built.</p>
    </DashboardPanel>
  );
}

function DashboardActionPanel({ action, state, setState, currentRole }) {
  const label = actionLabelMap[action] || action;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    loginId: '',
    grade: '5',
    section: 'A',
    amount: '',
    message: '',
    subject: '',
    description: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addEntity = (entityKey, entity, idField = 'id') => {
    setState(prev => ({
      ...prev,
      [entityKey]: [...(prev[entityKey] || []), { ...entity, [idField]: entity[idField] || `${entityKey.slice(0, 4).toUpperCase()}${Date.now()}` }]
    }));
    setFormData({ name: '', email: '', loginId: '', grade: '5', section: 'A', amount: '', message: '', subject: '', description: '' });
  };

  const renderEntityForm = (entityKey, entityName, extraFields = []) => (
    <>
      <form className="grid-form" onSubmit={(event) => {
        event.preventDefault();
        const newItem = {
          name: formData.name || `${entityName} ${Date.now()}`,
          email: formData.email || `${entityName.toLowerCase()}${Date.now()}@school.local`,
          loginId: formData.loginId || `${entityName.slice(0, 3).toUpperCase()}${Date.now()}`,
          ...extraFields.reduce((acc, field) => ({ ...acc, [field]: formData[field] || '' }), {})
        };
        addEntity(entityKey, newItem, 'loginId');
      }}>
        <label>
          {entityName} Name
          <input name="name" value={formData.name} onChange={handleChange} required placeholder={`Enter ${entityName} name`} />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} required placeholder={`Enter ${entityName.toLowerCase()} email`} />
        </label>
        <label>
          Login ID
          <input name="loginId" value={formData.loginId} onChange={handleChange} required placeholder={`Enter ${entityName.toLowerCase()} login ID`} />
        </label>
        {extraFields.map(field => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <input name={field} value={formData[field]} onChange={handleChange} placeholder={`Enter ${field}`} />
          </label>
        ))}
        <div className="form-actions"><button type="submit">Create {entityName}</button></div>
      </form>
      <div className="table-card" style={{ marginTop: '1.25rem' }}>
        <table>
          <thead>
            <tr>
              <th>{entityName}</th>
              <th>Identifier</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {(state[entityKey] || []).map((item, idx) => (
              <tr key={`${entityKey}-${idx}`}>
                <td>{item.name || item.employeeId || item.admissionNumber || item.loginId}</td>
                <td>{item.loginId || item.employeeId || item.admissionNumber || item.id || idx + 1}</td>
                <td>{item.email || 'n/a'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderSummaryTable = (rows, columns) => (
    <div className="table-card">
      <table>
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{columns.map(col => <td key={col}>{row[col] ?? row[col.toLowerCase()] ?? row[col.replace(/\s/g, '').toLowerCase()] ?? '-'}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const lowerAction = action.toLowerCase();
  let content = (
    <>
      <div className="metrics-grid">
        <div className="metric-card"><div>Action</div><div>{label}</div></div>
        <div className="metric-card"><div>Role controls</div><div>{currentRole || 'Applicable dashboard'}</div></div>
      </div>
      <p className="info-text">This dashboard section is available and can be extended with backend logic for full workflow support.</p>
    </>
  );

  if (lowerAction.includes('create') && lowerAction.includes('teacher')) {
    content = renderEntityForm('teachers', 'Teacher', ['subjects']);
  } else if (lowerAction.includes('create') && lowerAction.includes('student')) {
    content = renderEntityForm('students', 'Student', ['grade', 'section']);
  } else if (lowerAction.includes('create') && lowerAction.includes('parent')) {
    content = renderEntityForm('parents', 'Parent', ['contact', 'child']);
  } else if (lowerAction.includes('create') && lowerAction.includes('staff')) {
    content = renderEntityForm('staff', 'Staff', ['department', 'status']);
  } else if (lowerAction.includes('create') && lowerAction.includes('admin')) {
    content = renderEntityForm('admins', 'Admin');
  } else if (lowerAction.includes('create') && lowerAction.includes('accountant')) {
    content = renderEntityForm('accountants', 'Accountant');
  } else if (lowerAction.includes('create') && lowerAction.includes('vice')) {
    content = renderEntityForm('vicePrincipals', 'Vice Principal');
  } else if (lowerAction.includes('manage') && lowerAction.includes('teacher')) {
    content = renderSummaryTable(state.teachers, ['employeeId', 'name', 'subjects', 'salary']);
  } else if (lowerAction.includes('manage') && lowerAction.includes('parent')) {
    content = renderSummaryTable(state.parents, ['loginId', 'name', 'email', 'contact']);
  } else if (lowerAction.includes('manage') && lowerAction.includes('staff')) {
    content = renderSummaryTable(state.staff, ['employeeId', 'name', 'department', 'status']);
  } else if (lowerAction.includes('attendance')) {
    content = (
      <>
        <div className="metrics-grid">
          <div className="metric-card"><div>Students</div><div>{state.students.length}</div></div>
          <div className="metric-card"><div>Average attendance</div><div>{Math.round(state.students.reduce((sum, s) => sum + ((s.attendance.present / (s.attendance.present + s.attendance.absent + s.attendance.late || 1)) * 100), 0) / state.students.length || 0)}%</div></div></div>
        {renderSummaryTable(state.students.map(student => ({ Name: student.name, Grade: student.grade, Present: student.attendance.present, Absent: student.attendance.absent })), ['Name', 'Grade', 'Present', 'Absent'])}
      </>
    );
  } else if (lowerAction.includes('markattendance') || lowerAction.includes('entermarks') || lowerAction.includes('uploadassignments') || lowerAction.includes('createexams') || lowerAction.includes('scheduleexams') || lowerAction.includes('downloadmaterials') || lowerAction.includes('downloadreportcards') || lowerAction.includes('submitassignments') || lowerAction.includes('trackstudentprogress')) {
    content = (
      <>
        <div className="metrics-grid">
          <div className="metric-card"><div>Students</div><div>{state.students.length}</div></div>
          <div className="metric-card"><div>Teachers</div><div>{state.teachers.length}</div></div>
        </div>
        <div className="table-card">
          <table>
            <thead><tr><th>Item</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Assignments</td><td>Ready</td></tr>
              <tr><td>Exams</td><td>Planned</td></tr>
              <tr><td>Report cards</td><td>Available</td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  } else if (lowerAction.includes('fee') || lowerAction.includes('salary') || lowerAction.includes('expense') || lowerAction.includes('financial') || lowerAction.includes('tax') || lowerAction.includes('pay')) {
    const collected = state.financials.fees.filter(f => f.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
    const pending = state.financials.fees.filter(f => f.status !== 'Paid').reduce((sum, item) => sum + item.amount, 0);
    content = (
      <>
        <div className="metrics-grid">
          <div className="metric-card"><div>Collected</div><div>₹{collected.toLocaleString()}</div></div>
          <div className="metric-card"><div>Pending</div><div>₹{pending.toLocaleString()}</div></div>
        </div>
        {renderSummaryTable(state.financials.fees, ['id', 'student', 'type', 'amount', 'status'])}
      </>
    );
  } else if (lowerAction.includes('communicat') || lowerAction.includes('chat') || lowerAction.includes('staffcommunications') || lowerAction.includes('discipline')) {
    content = (
      <>
        <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="primary-button">Start message</button>
        </div>
        <div className="table-card">
          <table>
            <thead><tr><th>Topic</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Parent communication</td><td>Ready</td></tr>
              <tr><td>Teacher chat</td><td>Ready</td></tr>
              <tr><td>Discipline review</td><td>Open</td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  } else if (lowerAction.includes('hostel') || lowerAction.includes('inventory') || lowerAction.includes('certificate') || lowerAction.includes('campus') || lowerAction.includes('transport')) {
    content = (
      <>
        <div className="metrics-grid">
          <div className="metric-card"><div>Active resources</div><div>{state.schools.length}</div></div>
          <div className="metric-card"><div>Open tasks</div><div>{state.pendingAdmissions.length}</div></div>
        </div>
        <p className="info-text">This operational area is connected to school logistics and can be extended with inventory, transport, hostel and certification workflows.</p>
      </>
    );
  }

  return (
    <DashboardPanel title={label} subtitle={`Access the ${label} dashboard section.`}>
      {content}
    </DashboardPanel>
  );
}

const actionLabelMap = Object.values(roleOptions).flat().reduce((acc, item) => {
  acc[item.action] = item.label;
  return acc;
}, {});

function renderDashboardContent(action, state, setState, currentRole, user) {
  switch (action) {
    case 'renderCreateSchools':
      return <SchoolManagementPanel state={state} setState={setState} />;
    case 'renderCreatePrincipals':
      return <CreatePrincipalPanel state={state} setState={setState} />;
    case 'renderCreateTeachers':
      return <CreateTeacherPanel state={state} setState={setState} />;
    case 'renderCreateStudents':
      return <CreateStudentPanel state={state} setState={setState} />;
    case 'renderCreateParents':
      return <CreateParentPanel state={state} setState={setState} />;
    case 'renderMarkAttendance':
      return <MarkAttendancePanel state={state} user={state.user || user} />;
    case 'renderEnterMarks':
      return <EnterMarksPanel state={state} user={state.user || user} />;
    case 'renderUploadAssignments':
      return <UploadAssignmentsPanel state={state} setState={setState} user={state.user || user} />;
    case 'renderCreateExams':
      return <CreateExamsPanel state={state} setState={setState} user={state.user || user} />;
    case 'renderCommunicateWithParents':
      return <CommunicateWithParentsPanel state={state} setState={setState} user={state.user || user} />;
    case 'renderTrackStudentProgress':
      return <TrackStudentProgressPanel state={state} user={state.user || user} />;
    case 'renderCreateAdmins':
      return <CreateAdminPanel state={state} setState={setState} />;
    case 'renderCreateAccountants':
      return <CreateAccountantPanel state={state} setState={setState} />;
    case 'renderCreateVicePrincipals':
      return <CreateVicePrincipalPanel state={state} setState={setState} />;
    case 'renderApproveAdmissions':
      return <ApproveAdmissionsPanel state={state} setState={setState} />;
    case 'renderGenerateReports':
      return <GenerateReportsPanel state={state} />;
    case 'renderSendAnnouncements':
      return <SendAnnouncementsPanel state={state} setState={setState} />;
    case 'renderManageSubscriptions':
      return <SubscriptionPanel state={state} />;
    case 'renderSystemSettings':
      return <SystemSettingsPanel />;
    case 'renderBackupRestore':
      return <BackupRestorePanel />;
    case 'renderAuditLogs':
      return <AuditLogsPanel state={state} />;
    case 'renderStudentRecords':
    case 'renderManageStudents':
      return <StudentRecordsPanel state={state} />;
    case 'renderViewTotalStudents':
      return <DashboardPanel title="Total Students" subtitle="View total enrolled students."><div className="metrics-grid"><div className="metric-card"><div>Enrolled learners</div><div>{state.students.length}</div></div></div></DashboardPanel>;
    case 'renderViewTotalTeachers':
      return <DashboardPanel title="Total Teachers" subtitle="View total teaching staff."><div className="metrics-grid"><div className="metric-card"><div>Teachers</div><div>{state.teachers.length}</div></div></div></DashboardPanel>;
    case 'renderViewRevenueReports':
      return <RevenueReportsPanel state={state} />;
    case 'renderApproveLeaveRequests':
      return <LeaveRequestsPanel state={state} setState={setState} />;
    case 'renderReviewAcademicReports':
      return <AcademicReportsPanel state={state} />;
    case 'renderTransportManagement':
      return <TransportManagementPanel />;
    default:
      return <DashboardActionPanel action={action} state={state} setState={setState} currentRole={currentRole} />;
  }
}

function DashboardShell({ user, currentRole, activeAction, setActiveAction, state, setState, handleLogout, searchQuery, setSearchQuery, searchResults, performSearch }) {
  const actions = roleOptions[currentRole] || roleOptions['Super Admin'];

  return (
    <div className={`app-shell role-${currentRole.replace(/\s+/g, '-')}`}>
      <div className="topbar">
        <div>
          <h1>{currentRole} Dashboard</h1>
          <p>{user?.email || 'Signed in user'}</p>
        </div>
        <div className="topbar-controls">
          <div className="search-bar">
            <input
              type="search"
              value={searchQuery}
              placeholder="Search students, teachers or records"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                performSearch(e.target.value);
              }}
            />
          </div>
          <button className="secondary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="main-grid">
        <aside className="sidebar">
          <div className="sidebar-title">{currentRole} Actions</div>
          <div className="sidebar-actions">
            {actions.map(action => (
              <button
                key={action.action}
                type="button"
                className={activeAction === action.action ? 'active' : ''}
                onClick={() => setActiveAction(action.action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </aside>
        <main className="workspace">
          {renderDashboardContent(activeAction, state, setState, currentRole, user)}
        </main>
        <aside className="notifications-panel">
          <div className="sidebar-title">Notifications</div>
          {searchResults ? (
            searchResults.map(result => (
              <div key={result.admissionNumber} className="notification-card">
                <div>{result.name}</div>
                <div>{result.admissionNumber}</div>
              </div>
            ))
          ) : (
            state.notifications.map(note => (
              <div key={note.id} className="notification-card">
                <div>{note.message}</div>
                <div className="info-text">{note.time}</div>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}

const initialState = {
  schools: [
    { id: 'SCH100', name: 'Cedar Valley High School', location: 'Sector 22', board: 'CBSE', licenseKey: 'LIC-9842', status: 'Active', tier: 'Enterprise' },
    { id: 'SCH101', name: 'Sunrise Academy', location: 'Downtown', board: 'ICSE', licenseKey: 'LIC-1033', status: 'Suspended', tier: 'Premium' }
  ],
  students: [
    { admissionNumber: 'STD001', name: 'Aarav Singh', grade: '5', section: 'A', parent: { name: 'Pooja Singh', contact: '9876543210' }, attendance: { present: 152, absent: 8, late: 2 }, marks: { Math: 88, Science: 92, English: 85 }, status: 'Active' },
    { admissionNumber: 'STD002', name: 'Meera Sharma', grade: '6', section: 'B', parent: { name: 'Suresh Sharma', contact: '9876512340' }, attendance: { present: 148, absent: 12, late: 1 }, marks: { Math: 92, Science: 89, English: 90 }, status: 'Active' },
    { admissionNumber: 'STD003', name: 'Riya Patel', grade: '4', section: 'C', parent: { name: 'Nilesh Patel', contact: '9876501234' }, attendance: { present: 160, absent: 4, late: 0 }, marks: { Math: 95, Science: 94, English: 91 }, status: 'Active' }
  ],
  teachers: [
    { employeeId: 'TCH100', name: 'Priya Nair', subjects: ['Mathematics', 'Physics'], salary: 62000, leaveStatus: 'Pending', assignedClasses: ['5A', '6B'] },
    { employeeId: 'TCH101', name: 'Rahul Kapur', subjects: ['English', 'History'], salary: 58000, leaveStatus: 'Approved', assignedClasses: ['4C'] },
    { employeeId: 'TCH102', name: 'Sneha Rao', subjects: ['Biology', 'Chemistry'], salary: 65000, leaveStatus: 'None', assignedClasses: ['6B', '5A'] }
  ],
  parents: [
    { loginId: 'P-STD001', name: 'Pooja Singh', email: 'pooja.singh@school.edu', contact: '9876543210', child: 'Aarav Singh' }
  ],
  staff: [
    { employeeId: 'STF100', name: 'Sunil Kumar', email: 'sunil.kumar@school.edu', department: 'Transport', status: 'Active' }
  ],
  principals: [],
  admins: [],
  accountants: [],
  vicePrincipals: [],
  financials: {
    fees: [
      { id: 'FEE001', student: 'Aarav Singh', grade: '5', type: 'Tuition', amount: 45000, dueDate: '2026-07-05', status: 'Pending' },
      { id: 'FEE002', student: 'Meera Sharma', grade: '6', type: 'Transport', amount: 12000, dueDate: '2026-07-15', status: 'Paid' },
      { id: 'FEE003', student: 'Riya Patel', grade: '4', type: 'Hostel', amount: 55000, dueDate: '2026-08-01', status: 'Pending' }
    ],
    expenses: [
      { id: 'EXP100', category: 'Utilities', description: 'Electricity bill for June', amount: 22000, date: '2026-06-10' },
      { id: 'EXP101', category: 'Maintenance', description: 'Lift servicing', amount: 12500, date: '2026-06-12' }
    ]
  },
  notifications: [
    { id: 1, message: '[Teacher uploaded homework] Homework posted for Grade 5.', channels: ['Student', 'Parent'], time: '09:02 AM' },
    { id: 2, message: '[Fee payment successful] Aarav Singh fee cleared.', channels: ['Accountant', 'Parent'], time: '08:50 AM' },
    { id: 3, message: '[Principal approved admission] New student batch admitted.', channels: ['Admin', 'Parent', 'Accountant'], time: '08:15 AM' }
  ],
  auditLogs: [
    { id: 'AL001', action: 'Created new school profile', user: 'Super Admin', time: '07:45 AM', ip: '192.168.1.11' },
    { id: 'AL002', action: 'Approved admission request', user: 'Principal', time: '08:15 AM', ip: '192.168.1.22' }
  ],
  pendingAdmissions: [
    { admissionNumber: 'PEN100', name: 'Kabir Jain', grade: '5', section: 'A', parent: 'Rashmi Jain' },
    { admissionNumber: 'PEN101', name: 'Neha Verma', grade: '6', section: 'B', parent: 'Kiran Verma' }
  ],
  leaveRequests: [
    { id: 'LR100', teacher: 'Priya Nair', date: '2026-06-18', reason: 'Medical appointment', status: 'Pending' },
    { id: 'LR101', teacher: 'Rahul Kapur', date: '2026-06-20', reason: 'Personal work', status: 'Pending' }
  ],
  assignments: [
    { id: 'ASG100', title: 'Algebra practice', subject: 'Mathematics', deadline: '2026-06-28', createdBy: 'Priya Nair' }
  ],
  announcements: [],
  messages: []
};

function App() {
  const [state, setState] = useState(initialState);
  const [currentRole, setCurrentRole] = useState('Super Admin');
  const [activeAction, setActiveAction] = useState(roleOptions['Super Admin'][0].action);
  const [activePublicPage, setActivePublicPage] = useState('Home');
  const [user, setUser] = useState(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState(null);
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const openLoginPage = (role = null) => {
    setSelectedLoginRole(role);
    setActivePublicPage('Login');
  };
  const openSuperAdminSignup = () => setActivePublicPage('SuperAdminPortal');
  const openPublicHome = () => {
    setSelectedLoginRole(null);
    setActivePublicPage('Home');
  };

  const renderPublicPage = (page) => {
    switch (page) {
      case 'Home':
        return <HomePage state={state} openLoginPage={openLoginPage} openSuperAdminSignup={openSuperAdminSignup} />;
      case 'About':
        return <AboutSchool />;
      case 'Admissions':
        return <AdmissionsPage state={state} />;
      case 'Academics':
        return <AcademicsPage />;
      case 'Gallery':
        return <GalleryPage />;
      case 'Announcements':
        return <AnnouncementsPage state={state} />;
      case 'Contact':
        return <ContactPage />;
      case 'Login':
        return <RoleLoginPage onSubmit={handleLogin} authError={authError} onCancel={openPublicHome} selectedRole={selectedLoginRole} />;
      case 'SuperAdminPortal':
        return <SuperAdminSignupPage onSubmit={handleSignUp} authError={authError} onCancel={openPublicHome} />;
      default:
        return <HomePage state={state} openLoginPage={openLoginPage} openSuperAdminSignup={openSuperAdminSignup} />;
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [schoolsRes, studentsRes, teachersRes] = await Promise.all([
          axios.get('/api/schools'),
          axios.get('/api/students'),
          axios.get('/api/teachers')
        ]);
        setState(prev => ({
          ...prev,
          schools: schoolsRes.data.length ? schoolsRes.data : prev.schools,
          students: studentsRes.data.length ? studentsRes.data : prev.students,
          teachers: teachersRes.data.length ? teachersRes.data : prev.teachers
        }));
      } catch (error) {
        console.error('Failed to load backend data:', error);
      }
    };
    fetchData();
  }, [user]);

  const selectedStudents = useMemo(() => state.students.filter(student => student.grade === '5'), [state.students]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    const form = event.target;
    const identifier = form.loginEmail.value;
    const password = form.loginPassword.value;

    try {
      const response = await axios.post('/api/auth/login', { identifier, password });
      const token = response.data.token;
      const role = normalizeRole(response.data.role);
      setUser({ email: identifier, role, userId: response.data.userId, token });
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setCurrentRole(role);
      setActiveAction(roleOptions[role]?.[0]?.action || 'renderStudentRecords');
      setActivePublicPage('Home');
      form.reset();
    } catch (err) {
      console.error('Login failed', err);
      setAuthError(err.response?.data?.error || 'Login failed.');
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setAuthError('');
    const form = event.target;
    const fullName = form.signupName?.value || '';
    const email = form.signupEmail.value;
    const password = form.signupPassword.value;

    try {
      const response = await axios.post('/api/auth/register', { email, password, role: 'Super Admin', name: fullName });
      const token = response.data.token;
      setUser({ email, role: 'Super Admin', userId: response.data.userId, token });
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setCurrentRole('Super Admin');
      setActiveAction(roleOptions['Super Admin'][0].action);
      form.reset();
      setActivePublicPage('Home');
    } catch (err) {
      console.error('Sign up failed', err);
      setAuthError(err.response?.data?.error || 'Sign up failed.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
    setAuthError('');
    setCurrentRole('Super Admin');
    setActiveAction(roleOptions['Super Admin'][0].action);
    setSearchQuery('');
    setSearchResults(null);
    setActivePublicPage('Home');
  };

  const performSearch = (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      setSearchResults(null);
      return;
    }

    const studentMatches = state.students.filter(student => {
      return [
        student.name,
        student.admissionNumber,
        student.grade,
        student.section,
        student.email,
        student.parent?.name,
        student.parent?.contact
      ].some(value => value && value.toString().toLowerCase().includes(normalized));
    });
    setSearchResults(studentMatches);
  };

  if (user) {
    return (
      <DashboardShell
        user={user}
        currentRole={currentRole}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        state={state}
        setState={setState}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        performSearch={performSearch}
      />
    );
  }

  return (
    <div className="App">
      {renderPublicPage(activePublicPage)}
    </div>
  );
}

export default App;