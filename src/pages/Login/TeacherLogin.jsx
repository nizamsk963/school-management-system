import RoleLogin from "../../components/Auth/RoleLogin";

function TeacherLogin() {
  return (
    <RoleLogin
      title="👨‍🏫 Teacher Login"
      role="teacher"
      redirectPath="/teacher"
    />
  );
}

export default TeacherLogin;