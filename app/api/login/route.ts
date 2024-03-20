// app/api/login/route.ts
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {

    if (req.method === 'POST') {
        try {
            const { username, password } = await req.json();
            console.log('Received username:', username);
            console.log('Received password:', password);

            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

            // User not found or incorrect password
            if (result.rows.length === 0) {
                client.release();
                return NextResponse.json({ error: 'Invalid username or password' });
            }

            // Authentication successful
            client.release();
            return NextResponse.json({ message: 'User successful login' });

        } catch (error) {
            console.error('Error authenticating user:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}
