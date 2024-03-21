<<<<<<< HEAD
import { logout } from '../../utils/actions'
export default function AccountPage() {
    return (
        <div>
            <p>Account Page</p>
            <form action={logout}>
                <button className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">logout</button>
            </form>
        </div>
    );
};
=======
'use client'

import { logout } from '../../../utils/actions'
import { login } from '../../../utils/actions';
import { useState, useEffect } from 'react';
import Background from "../../../ui/home/Background";
import { useFormState } from "react-dom";
import { redirect } from 'next/navigation';
import { getSession } from '../../../utils/actions'
import { SessionData } from '@/app/utils/lib';

export interface UserData {
    uid: number;
    username: string;
}

export default function AccountPage() {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
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
        // Call fetchSessionData
        fetchSessionData()
            .then(() => {
                // Define fetchUserData inside the useEffect callback
                const fetchUserData = async () => {

                    try {
                        if (parseInt(sessionData?.uid || '0') === 1) {
                            const response = await fetch('/api/account');
                            if (response.ok) {
                                const data = await response.json();

                                setUserData(data.users);
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
            });
    }, [sessionData?.uid]);

    const handleDelete = async (uid: number) => {
        console.log(uid)
        try {
            const data = { uid: uid };

            // Send a DELETE request to the API to delete the user with the given UID
            const response = await fetch(`/api/account/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If deletion is successful, remove the deleted user from the userData state
                setUserData(userData.filter(user => user.uid !== uid));
            } else {
                console.error('Failed to delete user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Background>
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-2xl font-semibold mb-4">Registered Users</p>

                {(parseInt(sessionData?.uid || '0') === 1) && (
                    <table className="border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black px-4 py-2">Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData
                                .filter(user => user.uid !== 1) // Filter out the user with uid equal to 1
                                .map((user) => (
                                    <tr key={user.uid}>
                                        <td className="border border-black px-4 py-2">{user.username}</td>
                                        <td className="border border-black px-4 py-2">
                                            <button onClick={() => handleDelete(user.uid)}
                                                className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                )}
                <form action={logout}>
                    <button className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">logout</button>
                </form>
            </div>

        </Background>

    );
}
>>>>>>> main
