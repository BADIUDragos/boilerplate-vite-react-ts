import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  username: string;
  permissions: string[];
  email: string;
  isSuperuser: boolean;
  isStaff: boolean;
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const { id, username, permissions, email, isSuperuser, isStaff } = decoded;
    return { id, username, permissions, email, isSuperuser, isStaff };
  } catch (error) {
    console.error("Failed to decode token:", error, token);
    return null;
  }
}
