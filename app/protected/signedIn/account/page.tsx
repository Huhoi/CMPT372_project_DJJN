"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const router = useRouter();

    const logout = async () => {
        if (confirm("Are you sure you want to log out?")) {
            try {
                const { data } = await axios.post("/api/logout");
                alert(JSON.stringify(data));
                // Redirect the user to /
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
            <button
                onClick={logout}
                className="border-2 border-text-slate-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white"
            >
                Log Out
            </button>
        </div>
    );
}
