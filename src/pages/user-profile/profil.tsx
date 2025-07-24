import ProfileForm from 'components/userProfile/profil/ProfileForm'
import UserProfile from 'pages/layouts/UserProfile'
import React from 'react'

const ProfilPage = () => {
    return (
        <UserProfile>
            <h2 className="text-[20px] font-bold text-[#7952B3] mb-2">Profil Saya</h2>
            <p className="text-gray-500 mb-6">Pastikan informasi akun kamu selalu up to date untuk digunakan saat berbelanja.</p>
            <div className='bg-white  rounded-[10px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                <ProfileForm />
            </div>
        </UserProfile>
    )
}

export default ProfilPage