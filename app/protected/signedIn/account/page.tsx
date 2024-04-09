"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useTestContext } from "../../layout";
import { useState, useEffect } from 'react';
import { TrashIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { Trade_Winds } from "next/font/google";

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


    const handleDelete: (uid: number) => void = async (uid: number) => {
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


    if (uid !== 1) {
        return (
            <div>
                <button onClick={logout} className="flex items-center hover:text-red-600 mr-2 font-semibold ">
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6 hover:text-red-600 mr-2" />
                    Log Out
                </button>
            </div>
        );
    }

    return (
        <div>
            <table aria-label="User data table" className="w-full text-sm text-left text-gray-500">
                <thead className="text-4xl text-black uppercase ">
                    <tr>
                        <th>Username</th>
                        <th>User ID</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody className="text-xl text-gray-800 " >
                    {userData.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-100 font-semibold rounded-full">
                            <td >{user.username}</td>
                            <td>{user.uid}</td>
                            <td>
                                <button onClick={() => handleDelete(user.uid)}>
                                    <TrashIcon className="h-6 w-6 hover:text-red-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={logout} className="flex items-center hover:text-red-600 mr-2 font-semibold mt-4 ">
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6 hover:text-red-600 mr-2" />
                Log Out
            </button>

        </div>
    );
}
