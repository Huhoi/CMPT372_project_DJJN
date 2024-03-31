// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/constants";

// To handle a POST request to /api/logout
export async function POST(req: Request) {

    // Clear the cookie by setting its expiration date to a past time
    const seralized = serialize(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1, // Set maxAge to -1 or 0 to invalidate the cookie
        path: "/",
    });

    const response = { message: 'Logged out successfully' };

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Set-Cookie": seralized },
    });
}
