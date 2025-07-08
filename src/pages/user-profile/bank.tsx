import BankAccountPage from 'components/userProfile/BankAccountPage'
import UserProfile from 'pages/layouts/UserProfile'
import React from 'react'

const BankPage = () => {
    return (
        <UserProfile>
            <BankAccountPage />
        </UserProfile>
    )
}

export default BankPage