// app/api/register/route.js 

import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export const config = {
  api: {
    bodyParser: true,
  },
};

// To handle a GET request to /api/register
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const client = await pool.connect();
        console.log("Connected to db in register endpoint")
        
        const result = await client.query('SELECT * FROM users')
        const data = result.rows;

        client.release(); // Release the client back to the pool
        return NextResponse.json({ users: data });
    }
}

// To handle a POST request to /api/register
export async function POST(req: Request) {
    if (req.method === 'POST') {
    
        console.log("register POST Request")
        const {username, password} = await req.json();
        console.log( username, password)

        try {
            // Check if the user already exists
            const client = await pool.connect();
            const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            if (existingUser.rows.length > 0) {
                client.release(); // Release the client back to the pool
                throw new Error("User already exists");
            }

            // If user doesn't exist, create the user
            await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
            
            client.release(); // Release the client back to the pool

            // Respond with success message
            return NextResponse.json({ message: 'user sucessfully added' });
        } catch (error) {

            return NextResponse.json({ error: 'internal server error' });
        }

    }
}
