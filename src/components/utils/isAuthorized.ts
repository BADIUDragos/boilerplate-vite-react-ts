import { UserInfoState } from "../../store/interfaces/authInterfaces";

const isAuthorized = (
  userInfo: UserInfoState | null, 
  requiredPermissions: string[] = [],
  superuser?: boolean, 
  staff?: boolean,
): boolean => {
  
  let isAuthorized = false;

  if (superuser) {
    isAuthorized = true
  } else if (staff === true && userInfo?.isStaff) {
    isAuthorized = true
  } else {
    isAuthorized = requiredPermissions.every((permission: string) =>
        userInfo?.permissions?.includes(permission)
      );
  }

  return isAuthorized;
};

export default isAuthorized;
