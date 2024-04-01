"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useTestContext } from "../../layout";
import { useState, useEffect } from 'react';

interface UserData {
    uid: number;
    username: string;

}

export default function AccountPage() {
    const router = useRouter();
    const uid = useTestContext();
    const [userData, setUserData] = useState<UserData[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (uid === 1) {
                    const response = await fetch('/api/account');
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data.users.filter((user: UserData) => user.uid !== 1)); // Filter out user with uid equal to 1
                    } else {
                        console.error('Failed to fetch user data:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [uid]);


    const handleDelete = async (uid: number) => {
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


    const logout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            try {
                const { data } = await axios.post('/api/logout');
                alert(JSON.stringify(data));
                router.push('/');
            } catch (e) {
                const error = e as AxiosError;
                alert(error.message);
            }
        }
    };


    return (
        <div>
            <p>Account Page</p>

            <table className="border-collapse border border-black">
                <thead>
                    <tr>
                        <th className="border border-black px-4 py-2">Username</th>
                        <th className="border border-black px-4 py-2">User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user) => (
                        <tr key={user.uid}>
                            <td className="border border-black px-4 py-2">{user.username}</td>
                            <td className="border border-black px-4 py-2">{user.uid}</td>
                            <td className="border border-black px-4 py-2">
                                <button onClick={() => handleDelete(user.uid)}
                                    className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={logout}
                className="border-2 border-text-slate-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white"
            >
                Log Out
            </button>

        </div>
    );
}