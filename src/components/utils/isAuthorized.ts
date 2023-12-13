import { UserInfoState } from "../../store/interfaces/authInterfaces";

const isAuthorized = (
  userInfo: UserInfoState | null, 
  requiredPermissions: string[] = [],
  requiredStaff?: boolean,
): boolean => {
  

  if (!userInfo) return false

  if (userInfo.isSuperuser) return true

  if (requiredStaff && !userInfo.isStaff) return false;

  return requiredPermissions.every(permission => userInfo.permissions?.includes(permission));

};

export default isAuthorized;
