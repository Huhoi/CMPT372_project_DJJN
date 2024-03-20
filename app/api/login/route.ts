// app/api/login/route.ts
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export const config = {
    api: {
        bodyParser: true,
    },
};

// To handle a POST request to /api/login
export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { username, password } = await req.json();

            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

            if (result.rows.length === 0) {
                // User not found or incorrect password
                client.release();
                return NextResponse.json({ error: 'Invalid username or password' });
            }

            // Retrieve the authenticated user
            const user = result.rows[0];


            // Authentication successful
            client.release();
            return NextResponse.json({ message: 'User successful login', uid: user.uid, username: user.username });
        } catch (error) {
            console.error('Error authenticating user:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}