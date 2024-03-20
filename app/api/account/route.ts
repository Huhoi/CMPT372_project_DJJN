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
                NextResponse.json({ error: 'User not authenticated' });
            }

            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users WHERE uid = $1', [session.uid]);

            // User not found
            if (result.rows.length === 0) {
                client.release();
                return NextResponse.json({ error: 'User not found' });
            }

            // Retrieve the user data
            const user = result.rows[0];

            // Release client
            client.release();

            // Return user data
            NextResponse.json({ user });
        } catch (error) {
            console.error('Error fetching user data:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}