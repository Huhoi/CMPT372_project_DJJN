// app/api/login/route.ts
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import pool from '../../utils/connectDB';
import { COOKIE_NAME } from "@/constants";

const MAX_AGE = 60 * 60; // 1 hour

// To handle a POST request to /api/login
export async function POST(req: Request) {

    const { username, password } = await req.json();

    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const client = await pool.connect();
    const result = await client.query(query, [username, password]);

    // User not found or incorrect password
    if (result.rows.length === 0) {
        client.release();
        return NextResponse.json({ message: 'Invalid username or password', }, { status: 401, });
    }

    // Retrieve the authenticated user
    const user = result.rows[0];
    // console.log("Authenticated User", user.uid, user.username, user.password);

    // Always check this
    const secret = process.env.JWT_SECRET || "";
    const token = sign(
        { uid: user.uid, username: user.username },
        secret, {
        expiresIn: MAX_AGE,
    }
    )

    const seralized = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: MAX_AGE,
        path: "/",
    });

    const response = { message: 'Authenticated' }

    // Authentication successful
    client.release();
    // return NextResponse.json({ message: 'User successful login', uid: user.uid, username: user.username });

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Set-Cookie": seralized },
    });
}