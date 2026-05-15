import RoleLogin from "../../components/Auth/RoleLogin";

function PrincipalLogin() {
  return (
    <RoleLogin
      title="👑 Principal Login"
      role="principal"
      redirectPath="/principal"
    />
  );
}

export default PrincipalLogin;