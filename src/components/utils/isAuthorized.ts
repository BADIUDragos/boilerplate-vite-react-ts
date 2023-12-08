import { UserInfoState } from "../../store/interfaces/authInterfaces";

const isAuthorized = (
  userInfo: UserInfoState | null, 
  requiredPermissions: string[] = [],
  requiredSuperUser?: boolean, 
  requiredStaff?: boolean,
): boolean => {
  

  if (!userInfo) return false

  if (userInfo.isSuperuser) return true

  if (requiredStaff && !userInfo.isStaff) return false;

  if (!requiredSuperUser) {
    return requiredPermissions.every(permission => userInfo.permissions?.includes(permission));
  }

  return false;

};

export default isAuthorized;
