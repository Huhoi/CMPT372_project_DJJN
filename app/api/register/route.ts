// app/api/register/route.js 

import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';

// To handle a POST request to /api/register
export async function POST(req: Request) {
    if (req.method === 'POST') {

        const { username, password } = await req.json();
        console.log("new user:", username, password);

        try {
            // Check if the user already exists
            const query = 'SELECT * FROM users WHERE username = $1';
            const client = await pool.connect();
            const existingUser = await client.query(query, [username]);

            if (existingUser.rows.length > 0) {
                client.release();
                console.log("username already exists");
                return NextResponse.json({ error: 'Username already exists' });
            }

            // If user doesn't exist, create the user
            await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);

            client.release();

            // Respond with success message
            console.log("added new user");
            return NextResponse.json({ message: 'User sucessfully added' });

        }
        catch (error) {
            console.error('Error adding user:', error);
            return NextResponse.json({ error: 'internal server error' });
        }

    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}
