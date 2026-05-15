import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole, loginPath, dashboardPath }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to={loginPath} replace />;
  }

  // Wrong role
  if (role !== allowedRole) {
    const roleRoutes = {
      teacher: "/teacher",
      student: "/student",
      parent: "/parent",
      principal: "/principal",
    };

    return <Navigate to={roleRoutes[role] || "/"} replace />;
  }

  // Access allowed
  return children;
}

export default ProtectedRoute;