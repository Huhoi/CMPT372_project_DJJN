// app/api/session/route.ts
"use server"
import { NextApiResponse, NextApiRequest } from 'next';
import { sessionOptions, SessionData, defaultSession } from '../../utils/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { getSession } from '@/app/utils/actions';



export async function GET(req: NextApiRequest) {
    const session = await getSession();
    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;

    }
    return session;

}