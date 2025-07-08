import ProfileForm from 'components/userProfile/ProfileForm'
import UserProfile from 'pages/layouts/UserProfile'
import React from 'react'

const ProfilPage = () => {
    return (
        <UserProfile>
            <div className='p-5'>
                <ProfileForm />
            </div>
        </UserProfile>
    )
}

export default ProfilPage