import { UserInfoState } from "../../store/interfaces/authInterfaces";

const isAuthorized = (
  userInfo: UserInfoState | null, 
  requiredPermissions: string[] = [],
  requiredSuperUser?: boolean, 
  requiredStaff?: boolean,
): boolean => {
  
  let isAuthorized = false;

  if (userInfo?.isSuperuser) {
    isAuthorized = true
  } else if (requiredStaff && userInfo?.isStaff && requiredSuperUser === false) {

    isAuthorized = requiredPermissions.every((permission: string) =>
        userInfo?.permissions?.includes(permission)
      )
  } else {
    isAuthorized = requiredPermissions.every((permission: string) =>
        userInfo?.permissions?.includes(permission)
      ) && requiredStaff === false && requiredSuperUser === false;
  }

  return isAuthorized;
};

export default isAuthorized;
