import React from 'react'

// --- BARU: Komponen Sapaan Pengguna ---
interface UserGreetingProps {
    isLoggedIn: boolean;
    userName?: string;
}

function UserGreeting({ isLoggedIn, userName = "Irvan" }: UserGreetingProps) {
    // URL avatar placeholder
    const avatarUrl = "https://placehold.co/48x48/EBF5FF/3B82F6?text=U";


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopProfile');
        window.location.href = '/';
    };
    return (
        <div className="container mx-auto md:px-4">
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                {isLoggedIn ? <div className="flex items-center gap-4">
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/EBF5FF/3B82F6?text=U'; }}
                    />
                    <div>
                        <h3 className="font-bold text-gray-800">Hai, {userName}</h3>
                        <p className="text-sm text-gray-500">Cek update di akunmu, yuk!</p>
                    </div>
                </div> : <div></div>}
                {
                    !isLoggedIn ?
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2 border border-gray-300 rounded-lg font-bold text-blue-600 hover:bg-gray-50 text-sm" onClick={() => window.location.href = '/auth/register'}>
                                Daftar
                            </button>
                            <button className="px-5 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm" onClick={() => window.location.href = '/auth/login'}>
                                Masuk
                            </button>
                        </div> :
                        <button className="px-5 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm" onClick={handleLogout}>
                            Logout
                        </button>
                }
            </div>
        </div>
    );
}


export default UserGreeting