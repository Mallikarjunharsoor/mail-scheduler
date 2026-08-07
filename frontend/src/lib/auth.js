import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "mail_scheduler_token";
export function getSavedToken() {
    return typeof window !== "undefined"
        ? localStorage.getItem(TOKEN_KEY)
        : null;
}
export function saveToken(token) {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token);
    }
}
export function clearToken() {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
    }
}
export function decodeAuthToken(token) {
    try {
        return jwtDecode(token);
    }
    catch {
        return null;
    }
}
