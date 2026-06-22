import dotenv from 'dotenv';

dotenv.config();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM2MzgyZGI3MmI0OWNkM2RmYjUyZmIiLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJlbWFpbCI6InN1cGVyYWRtaW4rMTc4MTkzODIyMTExNEBzY2hvb2wubG9jYWwiLCJpYXQiOjE3ODE5MzgyMjEsImV4cCI6MTc4MTk4MTQyMX0.4_BAUqKTH3tZIiiGE5gEl55fl7_CCjk-ZghYnGiezxc';

const body = { email: 'principal@school.local', password: 'PrincipalPass1!', role: 'Principal' };

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    console.log('Status:', res.status);
    try {
      console.log(JSON.parse(text));
    } catch { console.log(text); }
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
