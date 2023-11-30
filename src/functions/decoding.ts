import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    const { id, username, permissions, email, isSuperuser } = decoded;
    return { id, username, permissions, email, isSuperuser };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
