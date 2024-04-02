//UID GRAB
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "@/app/utils/interfaces";

//Only works in server components
export async function fetchData() {
    //Grab Cookie and decode
    var data: JwtPayload | undefined;
    try {
        const cookieStore = cookies();
        const token = cookieStore.get(COOKIE_NAME);

        if (!token) {
            throw new Error('No token found in cookie');
        }

        const { value } = token;

        const secret = process.env.JWT_SECRET || "";
        const decodedToken = verify(value, secret) as JwtPayload;

        data = decodedToken;
        console.log("Decoded token:", data.uid);

        return data.uid;
    } catch (error) {
        console.error('Error decoding cookie:', error);
    }

}
