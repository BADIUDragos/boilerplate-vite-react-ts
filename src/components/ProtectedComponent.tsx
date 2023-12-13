import { useAuth } from "../store";
import isAuthorized from "./utils/isAuthorized";
import RequireAtLeastOne from "../functions/typeGuards/requireAtLeastOne";

interface IProtectedComponent {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredStaff?: boolean;
}

type ProtectedComponentProps = RequireAtLeastOne<
  IProtectedComponent,
  "requiredPermissions" | "requiredStaff"
>;

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermissions = [],
  requiredStaff = false,
}) => {
  const { userInfo } = useAuth();

  return isAuthorized(userInfo, requiredPermissions, requiredStaff) ? (
    <>{children}</>
  ) : null;
};

export default ProtectedComponent;
