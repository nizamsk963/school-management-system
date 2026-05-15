import RoleLogin from "../../components/Auth/RoleLogin";

function ParentLogin() {
  return (
    <RoleLogin
      title="👨‍👩‍👧 Parent Login"
      role="parent"
      redirectPath="/parent"
    />
  );
}

export default ParentLogin;