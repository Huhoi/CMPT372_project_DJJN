'use client'
import { logout } from '../../utils/actions'
import { login } from '../../utils/actions';
import { useState, useEffect } from 'react';
import Background from "../../ui/home/Background";
import { useFormState } from "react-dom";
import { redirect } from 'next/navigation';
import { getSession } from '../../utils/actions'
import { SessionData } from '@/app/utils/lib';

interface UserData {
    uid: number;
    username: string;
}

export default function AccountPage() {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    console.log(sessionData, "sadasd");
    // Define a function to fetch session data
    const fetchSessionData = async () => {
        try {
            // Make a GET request to the /api/session endpoint
            const response = await fetch('/api/session');
            if (response.ok) {
                // Parse the JSON response
                const data = await response.json();
                // Update the session data state with the response data
                setSessionData(data);
            } else {
                // Handle error response
                console.error('Failed to fetch session data:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error fetching session data:', error);
        }
    };

    useEffect(() => {
        // Define fetchUserData inside the useEffect callback
        const fetchUserData = async () => {
            try {
                if (sessionData?.uid === '1') {
                    const response = await fetch('/api/account');
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    } else {
                        console.error('Failed to fetch user data:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Call fetchUserData
        fetchUserData();

        // Call fetchSessionData
        fetchSessionData();
    }, []);


    return (
        <Background>
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-2xl font-semibold mb-4">Account Page</p>

                {(sessionData?.uid === '1') && (
                    <table className="border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black px-4 py-2">Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((user) => (
                                <tr key={user.uid}>
                                    <td className="border border-black px-4 py-2">{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <form action={logout}>
                <button className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">logout</button>
            </form>
        </Background>
    );
}