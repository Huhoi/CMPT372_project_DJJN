'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from "../../ui/home/Background";
import { login } from '../../utils/actions';
import { useFormState } from "react-dom";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [state, formAction] = useFormState<any, FormData>(login, undefined);

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch('/api/login', {
    //             method: 'POST',
    //             body: JSON.stringify({ username: username, password: password }),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             if (data.message === 'User successful login') {
    //                 // Redirect to homepage
    //                 router.push('/');
    //             } else {
    //                 // Server returned success status but user authentication failed
    //                 setError(data.error || 'Login failed');
    //             }
    //         } else {
    //             // Server returned error status
    //             const data = await response.json();
    //             setError(data.error || 'Login failed');
    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         setError('Internal server error');
    //     }
    // };

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
                                        <input type="text" name="username" placeholder="Username" className="bg-gray-100 outline-none text-sm flex-1" onChange={(e) => setUsername(e.target.value)} autoComplete='username' required/>
                                    </div>
                                    <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                                        <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1" onChange={(e) => setPassword(e.target.value)} autoComplete='current-password' required/>
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
