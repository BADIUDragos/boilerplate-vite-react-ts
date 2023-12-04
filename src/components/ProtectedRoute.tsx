import { Navigate } from "react-router-dom";
import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";
import RequireAtLeastOne from "./utils/requireAtLeastOne";

interface IProtectedRoute {
  children: React.ReactNode;
  redirectUrl?: string;
  requiredPermissions?: string[];
  requiredSuperUser?: boolean;
  requiredStaff?: boolean;
}

type ProtectedRouteProps = RequireAtLeastOne<IProtectedRoute, 'requiredPermissions' | 'requiredSuperUser' | 'requiredStaff'>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectUrl = "/login",
  requiredPermissions = [],
  requiredSuperUser = false,
  requiredStaff = false,
}) => {
  const userInfo = useUserInfo();

  return isAuthorized(userInfo, requiredPermissions, requiredSuperUser, requiredStaff) ? <>{children}</> : <Navigate to={redirectUrl} />;
};

export default ProtectedRoute;
