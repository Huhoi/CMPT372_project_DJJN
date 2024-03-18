"use client";

import { useState } from 'react';
import Background from "../../ui/home/Background";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // User registered successfully
        // Redirect or show success message
        router.push('/pages/login');
      } else {
        // Handle registration error
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Internal server error');
    }
  };

  return (
    <Background>
      <div id="loginPageContainer" className="absolute inset-0 flex items-center justify-center">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl">
            <div className="bg-gradient-to-r from-blue-300/20 to-indigo-300/20 text-slate-800 rounded-r-2xl rounded-l-2xl py-36 px-12">
              <h2 className="text-3xl font-bold mb-2"> Sign Up </h2>
              <div className="border-2 w-10 border-white inline-block mb-2"></div>
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                  <input type="username" name="username" placeholder="Username" className="bg-gray-100 outline-none text-sm flex-1" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                  <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <button type="submit" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Sign Up</button>
                <button onClick={() => router.push('/pages/login')} className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">Back</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </Background>
  );
}