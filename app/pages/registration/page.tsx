import Background from "../../ui/home/Background";
import Link from "next/link";

export default function RegistrationPage() {
    return (
        <Background>
            <div id="loginPageContainer" className="absolute inset-0 flex items-center justify-center">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl">
                        {/* Sign up section */}
                        <div className="bg-gradient-to-r from-blue-300/20 to-indigo-300/20 text-slate-800 rounded-r-2xl rounded-l-2xl py-36 px-12">
                            <h2 className="text-3xl font-bold mb-2"> Sign Up </h2>
                            <div className="border-2 w-10 border-white inline-block mb-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                                    <input type="username" name="username" placeholder="Username" className="bg-gray-100 outline-none text-sm flex-1" />
                                </div>
                                <div className="bg-gray-100 w-64 p-4 flex items-center mb-3">
                                    <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1" />
                                </div>
                                <Link href="/pages/registration" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:">Sign Up</Link>
                                <Link href="/pages/login" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:">Back</Link>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </Background>
    );
}
