// app/api/account/route.ts
"use server"
import { NextApiResponse, NextApiRequest } from 'next';
import { NextResponse } from "next/server";
import { sessionOptions, SessionData, defaultSession } from '../../utils/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { getSession } from '@/app/utils/actions';
import pool from '../../utils/connectDB';

// To handle a GET request to /api/account
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const session = await getSession();
            if (!session.isLoggedIn) {
                return NextResponse.json({ error: 'User not authenticated' });
            }

            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users');

            // Retrieve the user data
            const users = result.rows;

            // Release client
            client.release();

            // Return user data
            return NextResponse.json({ users });
        } catch (error) {
            console.error('Error fetching user data:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

// To handle a DELETE request to /api/account/
export async function DELETE(req: Request) {

    if (req.method === 'DELETE') {
        try {
            const { uid } = await req.json();
            console.log(uid)

            if (!uid) {
                return NextResponse.json({ error: 'User ID is required' });
            }

            const client = await pool.connect();
            const result = await client.query('DELETE FROM users WHERE uid = $1', [uid]);

            // Check if the user was deleted
            if (result.rowCount === 0) {
                client.release();
                return NextResponse.json({ error: 'User not found' });

            }

            // Release client
            client.release();

            // Return success message
            return NextResponse.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}
