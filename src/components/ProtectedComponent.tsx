import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";

interface IProtectedComponent {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredSuperUser?: boolean
  requiredStaff?: boolean
}

const ProtectedComponent: React.FC<IProtectedComponent> = ({
  children,
  requiredPermissions = [],
  requiredSuperUser = false,
  requiredStaff = false
}) => {
  
  const userInfo = useUserInfo()

  return isAuthorized(userInfo, requiredPermissions, requiredSuperUser, requiredStaff) ? <>{children}</> : null;
};

export default ProtectedComponent;