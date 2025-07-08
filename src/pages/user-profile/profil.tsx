import ProfileForm from 'components/userProfile/ProfileForm'
import UserProfile from 'pages/layouts/UserProfile'
import React from 'react'

const ProfilPage = () => {
    return (
        <UserProfile>
            <h2 className="text-xl font-bold text-[#333333] mb-6 ">Profil Saya</h2>
            <div className='p-5'>
                <ProfileForm />
            </div>
        </UserProfile>
    )
}

export default ProfilPage