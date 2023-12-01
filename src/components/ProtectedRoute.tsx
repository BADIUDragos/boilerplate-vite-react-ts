import { Navigate } from "react-router-dom";
import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";

interface IProtectedRoute {
  children: React.ReactNode;
  redirectUrl?: string;
  requiredPermissions?: string[];
  superuser?: boolean;
  staff?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({
  children,
  redirectUrl = "/login",
  requiredPermissions = [],
  superuser = false,
  staff = false,
}) => {
  const userInfo = useUserInfo();

  return isAuthorized(userInfo, requiredPermissions, superuser, staff) ? <>{children}</> : <Navigate to={redirectUrl} />;
};

export default ProtectedRoute;
