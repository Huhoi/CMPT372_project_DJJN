import { logout } from '../../utils/actions'
export default function AccountPage() {
    return (
        <div>
            <p>Account Page</p>
            <form action={logout}>
                <button className="border-2 border-blackrounded-full px-12 py-2 inline-block font-semibold hover:bg-slate-800 hover:text-white">logout</button>
            </form>
        </div>
    );
};