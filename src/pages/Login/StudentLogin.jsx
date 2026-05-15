import RoleLogin from "../../components/Auth/RoleLogin";

function StudentLogin() {
  return (
    <RoleLogin
      title="👨‍🎓 Student Login"
      role="student"
      redirectPath="/student"
    />
  );
}

export default StudentLogin;