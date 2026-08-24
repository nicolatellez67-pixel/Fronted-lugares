import { Navigate } from "react-router-dom";
import { getUsuario } from "../repositories/authRepository";

type ProtectedRouteProps = {
  children: React.ReactNode;
  soloAdmin?: boolean;
};

function ProtectedRoute({
  children,
  soloAdmin = false,
}: ProtectedRouteProps) {

  const usuario = getUsuario();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && usuario.rol !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;