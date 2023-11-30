import { UserInfoState } from "../../store/interfaces/authInterfaces";

const isAuthorized = (
  admin: boolean, 
  userInfo: UserInfoState | null, 
  requiredPermissions: string[] = []
): boolean => {
  
  let isAuthorized = false;

  if (userInfo) {
    if (admin) {
      isAuthorized = userInfo.isSuperuser;
    } else {
      isAuthorized = requiredPermissions.every((permission: string) =>
        userInfo.permissions?.includes(permission)
      );
    }
  } else {
    isAuthorized = !admin;
  }

  return isAuthorized;
};

export default isAuthorized;
