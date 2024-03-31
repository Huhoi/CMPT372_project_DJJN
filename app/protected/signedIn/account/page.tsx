"use client"
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/navigation';
import { useTestContext } from "../../layout";

export default function AccountPage() {
    const router = useRouter();
    const uid = useTestContext();

    if (uid === 1) {
        const fetchUserData = async () => {
            try {
                // Make a GET request to the /api/account endpoint
                const response = await fetch('/api/account');
                if (response.ok) {
                    // Parse the JSON response
                    const data = await response.json();
                    // Update the session data state with the response data
                    console.log("Fetched user data:", data);

                } else {
                    // Handle error response
                    console.error('Failed to fetch session data:', response.statusText);
                }
            } catch (error) {
                // Handle network or other errors
                console.error('Error fetching session data:', error);
            }
        };
        fetchUserData();
    }

    console.log(uid);

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
