import { Navigate } from "react-router-dom";
import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";

interface IProtectedRoute {
  children: React.ReactNode;
  redirectUrl?: string;
  requiredPermissions?: string[];
  admin?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({
  children,
  redirectUrl = "/login",
  requiredPermissions = [],
  admin = false,
}) => {
  const userInfo = useUserInfo();

  return isAuthorized(admin, userInfo, requiredPermissions) ? <>{children}</> : <Navigate to={redirectUrl} />;
};

export default ProtectedRoute;
