"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useTestContext } from "../../layout";
import { useState, useEffect } from 'react';
import { TrashIcon, ArrowLeftEndOnRectangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Trade_Winds } from "next/font/google";

interface UserData {
    uid: number;
    username: string;

}

export default function AccountPage() {
    const router = useRouter();
    const uid = useTestContext();
    const [userData, setUserData] = useState<UserData[]>([]);
    const [searchQueryUsername, setSearchQueryUsername] = useState<string>('');
    const [searchQueryUid, setSearchQueryUid] = useState<number | ''>('');

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

    const handleUsernameSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQueryUsername(event.target.value);
    };

    const handleUidSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQueryUid(value === '' ? '' : parseInt(value));
    };

    const filteredUsers = userData.filter(user =>
        user.username.toLowerCase().includes(searchQueryUsername.toLowerCase()) &&
        (searchQueryUid === '' || user.uid === searchQueryUid)
    );



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
            <table className=" font-sans w-full border-gray-300 text-center border-2 rounded">
                <thead className="text-4xl text-black uppercase bg-blue-200">
                    <tr>
                        <th>Username</th>
                        <th>User ID</th>
                        <th> </th>
                    </tr>
                </thead>
                <thead className="bg-gray-100">
                    <tr>
                        <th>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by username"
                                    value={searchQueryUsername}
                                    onChange={handleUsernameSearchChange}
                                    className="border border-gray-300 rounded-md pl-10 pr-4 py-2"
                                />
                                <MagnifyingGlassIcon className="absolute top-0 left-3 h-6 w-6 text-gray-400" />
                            </div>
                        </th>
                        <th>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Search by UID"
                                    value={searchQueryUid}
                                    onChange={handleUidSearchChange}
                                    className="border border-gray-300 rounded-md pl-10 pr-4 py-2"
                                />
                                <MagnifyingGlassIcon className="absolute top-0 left-3 h-6 w-6 text-gray-400" />
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-xl text-gray-800 bg-gray-100 font-mono">
                    {filteredUsers.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-100 font-semibold rounded-full">
                            <td>{user.username}</td>
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
            <button onClick={logout} className="flex items-center hover:text-red-600 mr-2 font-semibold mt-4">
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6 hover:text-red-600 mr-2" />
                Log Out
            </button>
        </div>
    );
}
