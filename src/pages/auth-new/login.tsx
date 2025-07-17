import type { NextPage } from 'next';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
// Komponen untuk ikon Google (inline SVG)
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const LoginPage: NextPage = () => {
    return (
        <AuthNewLayout>
            <div className="text-center">
                <h2 className="text-[22px] font-bold text-[#444444]">Masuk ke Zukses</h2>
                <p className="mt-2 text-[14px] font-medium text-[#444444]">
                    Belum punya Akun Zukses?{' '}
                    <span className="font-bold text-[14px] text-[#FF2D60] cursor-pointer" onClick={() => window.location.href = '/auth-new/register'}>
                        Daftar
                    </span>
                </p>
            </div>

            <form className="mt-4 space-y-4">
                {/* Input Nomor HP atau E-mail */}
                <div>
                    <label htmlFor="contact" className="sr-only">
                        Nomor HP atau E-mail
                    </label>
                    <input
                        id="contact"
                        name="contact"
                        type="text"
                        required
                        className="appearance-none rounded-[10px] relative block w-full px-3 py-3 border text-[16px] border-[#AAAAAA] placeholder:text-[#999999] placeholder:text-[16px] text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Masukkan Nomor HP atau E-mail"
                    />
                    <p className="mt-1 text-[12px] ml-4 font-[500] text-[#888888]">Contoh: 0123456789</p>
                </div>

                {/* Input PIN */}
                <div>
                    <label htmlFor="pin" className="sr-only">
                        PIN
                    </label>
                    <input
                        id="pin"
                        name="pin"
                        type="password"
                        required
                        className="appearance-none rounded-[10px] relative block w-full px-3 py-3 border text-[16px] border-[#AAAAAA] placeholder:text-[#999999] placeholder:text-[16px] text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Masukkan PIN"
                    />
                    <p className="text-[12px] text-[#555555] font-bold ml-4 mt-1 cursor-pointer" onClick={(() => window.location.href = '/auth-new/forget-password')}>
                        Lupa Password?
                    </p>
                </div>


                <div>
                    <button
                        type="submit"
                        className="group  h-[50px] relative w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Masuk
                    </button>
                </div>
            </form>

            {/* Pemisah */}
            <div className="my-6 flex items-center justify-center">
                <div className="flex-grow w-[81px] border-t border-[#CCCCCC]"></div>
                <span className="mx-4 text-[14px] font-[500] text-[#666666]">atau masuk dengan</span>
                <div className="flex-grow w-[81px] border-t border-[#CCCCCC]"></div>
            </div>

            {/* Tombol Login Google */}
            <div>
                <button
                    type="button"
                    className="w-full h-[50px] inline-flex justify-center items-center py-2 px-4 border border-[#AAAAAA] rounded-[10px] shadow-sm bg-white text-[16px] gap-1 font-bold text-[#777777] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <GoogleIcon />
                    Google
                </button>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="mt-6 text-center text-[14px] font-medium text-[#444444]">
                <p>Dengan masuk disini, kamu menyetujui</p>
                <span className="font-bold cursor-pointer text-[#FF2D60] hover:text-red-600">
                    Syarat & Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-bold cursor-pointer text-[#FF2D60] hover:text-red-600">
                    Kebijakan Privasi Zukses
                </span>
            </div>
        </AuthNewLayout>
    );
};

export default LoginPage;
