// app/api/login/route.ts
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export const config = {
    api: {
        bodyParser: true,
    },
};

// To handle a GET request to /api/login
export async function POST(req: Request) {

    if (req.method === 'POST') {
        try {
            const { username, password } = await req.json();
            // var username = 'user1';
            // var password = 'password';
            console.log('Received username:', username);
            console.log('Received password:', password);

            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

            if (result.rows.length === 0) {
                // User not found
                client.release();
                return NextResponse.json({ error: 'Invalid username or password1' });
            }

            const user = result.rows[0];
            if (user.password !== password) {
                // Incorrect password
                client.release();
                return NextResponse.json({ error: 'Invalid username or password2' });
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
