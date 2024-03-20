'use client'
import { useState, useEffect } from 'react';
import Background from "../../ui/home/Background";
import { login } from '../../utils/actions';
import { useFormState } from "react-dom";
import { redirect } from 'next/navigation';
import { getSession } from '../../utils/actions'
import { SessionData } from '@/app/utils/lib';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [state, formAction] = useFormState<any, FormData>(login, undefined);

    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    // Define a function to fetch session data
    const fetchSessionData = async () => {
        try {
            // Make a GET request to the /api/session endpoint
            const response = await fetch('/api/session');

            // Check if the response is successful (status code 200)
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

    // Use the useEffect hook to fetch session data when the component mounts
    useEffect(() => {
        fetchSessionData();
    }, []);

    // If sessionData is loaded and user is logged in, redirect
    useEffect(() => {
        if (sessionData && sessionData.isLoggedIn) {
            redirect('/'); // Redirect to the desired page
        }
    }, [sessionData]); // Trigger the effect whenever sessionData changes

    return (
        <Background>
            <div id="loginPageContainer" className="absolute inset-0 flex items-center justify-center">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                    <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                        {/* Sign up section */}
                        <div className="w-2/5 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 text-slate-800 rounded-tl-2xl rounded-bl-2xl py-36 px-12">
                            <h2 className="text-3xl font-bold mb-2"> Welcome! </h2>
                            <div className="border-2 w-10 border-white inline-block mb-2"></div>
                            <p className="mb-10"></p>
                            <a href="/pages/registration" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Sign Up</a>
                        </div>
                        {/* Sign in section */}
                        <div className="w-3/5 py-14 relative">
                            <div className="absolute top-0 right-0 m-5 text-right font-bold">
                                <span className="text-slate-800 italic">ChronnoPlanner 2 :eyes:</span>
                            </div>

                            {/* Login Form */}
                            <form className="w-5/5 p-2" action={formAction}>
                                <div className="py-10">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Account Login</h2>
                                    <div className="border-2 w-10 border-text-slate-800 inline-block"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                                        <input type="text"
                                            name="username"
                                            placeholder="Username"
                                            className="bg-gray-100 outline-none text-sm flex-1"
                                            required
                                        />

                                    </div>
                                    <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="bg-gray-100 outline-none text-sm flex-1"
                                            required
                                        />
                                    </div>
                                    {error && <div className="text-red-500 mb-2">{error}</div>}
                                    <button className="border-2 border-text-slate-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </Background>
    );
}
