import { SessionOptions } from "iron-session";

export interface SessionData {
    id?: string;
    username?: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false
}

export const sessionOptions: SessionOptions = {
    password: "passwordmustbeatleast32characterslong",
    cookieName: "user-session",
    cookieOptions: {
        httpOnly: true,
        secure: false,
    }

}