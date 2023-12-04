import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";
import RequireAtLeastOne from "./utils/requireAtLeastOne";

interface IProtectedComponent {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredSuperUser?: boolean
  requiredStaff?: boolean
}

type ProtectedComponentProps = RequireAtLeastOne<IProtectedComponent, 'requiredPermissions' | 'requiredSuperUser' | 'requiredStaff'>;

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermissions = [],
  requiredSuperUser = false,
  requiredStaff = false
}) => {
  
  const userInfo = useUserInfo()

  return isAuthorized(userInfo, requiredPermissions, requiredSuperUser, requiredStaff) ? <>{children}</> : null;
};

export default ProtectedComponent;