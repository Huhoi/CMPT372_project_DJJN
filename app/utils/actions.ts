"use server"
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions, SessionData, defaultSession } from '../utils/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";


export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;
    }
    return session;

}

export const login = async (
    prevState: { error: undefined | string },
    formData: FormData
) => {
    const session = await getSession();

    const formUsername = formData.get("username") as string
    const formPassword = formData.get("password") as string

    // Check user in DB by sending a POST request to /api/login
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: formUsername, password: formPassword }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        // Handle the response data accordingly (e.g., set session, redirect, etc.)
        const data = await response.json();

        if (data && data.message === 'User successful login') {
            session.uid = data.uid;
            session.isLoggedIn = true;

            await session.save();
            redirect('/');
        } else {
            redirect('/pages/login');
        }

    } else {
        // Handle error response from the API
        redirect('/pages/login');
    }
}

export const logout = async () => {
    const session = await getSession();
    session.destroy();
    redirect('/');
}

