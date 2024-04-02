"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useTestContext } from "../../layout";
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { TrashIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';

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

    // Move this to recipe page afterwards
    //Remember to test that it only request 1 per submission capped at 150
    const handleFetch = async () => {
        const query = 'pasta'
        const apiKey = '66a1a479f6384fcf8319c6a701e0637b'

        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }


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
            <h1 className="border-2 border-blackrounded-full px-10 py-2 inline-block font-semibold bg-slate-600 text-white rounded-2xl">
                Table of Registered Users</h1>
            <Table aria-label="User data table" className="border-2 border-blackrounded-full px-10 py-2 inline-block font-semibold bg-slate-600 text-white rounded-2xl">
                <TableHeader >
                    <TableColumn>Username</TableColumn>
                    <TableColumn>User ID</TableColumn>
                    <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody className="border-2 border-blackrounded-full">
                    {userData.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.uid}</TableCell>
                            <TableCell>
                                <button onClick={() => handleDelete(user.uid)}>
                                    <TrashIcon className="h-6 w-6 hover:text-red-600" />
                                </button>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            <button onClick={logout} className="flex items-center hover:text-red-600 mr-2 font-semibold ">
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6 hover:text-red-600 mr-2" />
                Log Out
            </button>

            <div>
                dasd
                asd
                asd
            </div>
            <button onClick={handleFetch} className="flex items-center hover:text-red-600 mr-2 font-semibold ">
                TEST SPOONACULAR API DONT CLICK UNLESS ITS NEEDED
            </button>
        </div>
    );
}