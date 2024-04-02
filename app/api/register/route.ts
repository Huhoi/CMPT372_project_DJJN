// app/api/register/route.js 

import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';

// To handle a POST request to /api/register
export async function POST(req: Request) {

    const { username, password } = await req.json();

    // Check if the user already exists
    const query = 'SELECT * FROM users WHERE username = $1';
    const client = await pool.connect();
    const existingUser = await client.query(query, [username]);

    if (existingUser.rows.length > 0) {
        client.release();
        return NextResponse.json({ message: 'Username already exists' });
    }

    // If user doesn't exist, create the user
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);

    client.release();

    // Respond with success message
    return NextResponse.json({ message: 'User sucessfully added' });

}
