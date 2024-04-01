// app/api/session/route.ts
"use server"
import { NextApiResponse, NextApiRequest } from 'next';
import { NextResponse } from "next/server";
import { sessionOptions, SessionData, defaultSession } from '../../utils/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { getSession } from '@/app/utils/actions';

import pool from '../../utils/connectDB';


export async function GET(res: Response) {
    try {
        const session = await getSession();
        if (!session.isLoggedIn) {
            session.isLoggedIn = defaultSession.isLoggedIn;
        }

        console.log(session)
        return NextResponse.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}