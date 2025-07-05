import MyOrdersPage from 'components/userProfile/MyOrdersPage'
import UserProfile from 'pages/layouts/UserProfile'
import React from 'react'

const MyOrder = () => {
    return (
        <UserProfile>
            <MyOrdersPage />
        </UserProfile>
    )
}

export default MyOrder