"use client"
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios';
import Background from "./ui/home/Background";

export default function LoginPage() {

    const router = useRouter()
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const payload = {
          username: event.currentTarget.username.value,
          password: event.currentTarget.password.value,
        };
    
        try {
            const { data } = await axios.post("/api/login", payload);
            
            // test: alert if user is authenticated checking the json 'message"
            // alert(JSON.stringify(data));
    
            // redirect the user to /dashboard
            router.push('/protected/dashboard')
        } catch (e) {
            const error = e as AxiosError;
        
            alert("Invalid Login Credentials");
        }
      };

    return (
        <Background>
            <div id="loginPageContainer" className="absolute inset-0 flex items-center justify-center">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-10 md:px-20 text-center">
                    <div className="bg-white rounded-2xl shadow-2xl flex flex-col sm:flex-row w-full max-w-4xl">
                        {/* Sign up section */}
                        <div className="w-full sm:w-2/5 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 text-slate-800 rounded-tl-2xl rounded-bl-2xl py-8 sm:py-36 px-6 sm:px-12">
                            <h2 className="text-3xl font-bold mb-2"> Welcome! </h2>
                            <div className="border-2 w-10 border-white inline-block mb-2"></div>
                            <p className="mb-10"></p>
                            <a href="/pages/registration" className="border-2 border-white rounded-full px-8 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white mt-4">Sign Up</a>
                        </div>
                        {/* Sign in section */}
                        <div className="w-full sm:w-3/5 py-8 sm:py-14 relative">
                            <div className="absolute top-0 right-0 m-5 text-right font-bold">
                                <span className="text-slate-800 italic">ChronnoPlanner 2 :eyes:</span>
                            </div>

                            {/* Login Form */}
                            <form className="w-full p-2" onSubmit={handleSubmit}>
                                <div className="py-10">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Account Login</h2>
                                    <div className="border-2 w-10 border-text-slate-800 inline-block"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-100 w-full sm:w-64 p-4 flex items-center mb-3">
                                        <input type="text"
                                            name="username"
                                            placeholder="Username"
                                            className="bg-gray-100 outline-none text-sm flex-1"
                                            autoComplete="username"
                                            required
                                        />

                                    </div>
                                    <div className="bg-gray-100 w-full sm:w-64 p-4 flex items-center mb-3">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="bg-gray-100 outline-none text-sm flex-1"
                                            autoComplete="password"
                                            required
                                        />
                                    </div>
                                    <button className="border-2 border-text-slate-800 rounded-full px-8 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white mb-4">Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </Background>
    );
}
