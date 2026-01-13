import { getToken } from "./authService";
import {jwtDecode} from "jwt-decode";

export const getRole = () => {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.role;
}
  