import { useUserInfo } from "../store";
import isAuthorized from "./utils/isAuthorized";

interface IProtectedComponent {
  children: React.ReactNode;
  requiredPermissions?: string[];
  admin?: boolean
}

const ProtectedComponent: React.FC<IProtectedComponent> = ({
  children,
  requiredPermissions = [],
  admin = false,
}) => {
  
  const userInfo = useUserInfo()

  return isAuthorized(admin, userInfo, requiredPermissions) ? <>{children}</> : null;
};

export default ProtectedComponent;