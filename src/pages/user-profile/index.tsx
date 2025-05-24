import { useSearchParams } from 'next/navigation';
import React from 'react'

type Props = {}

const UserProfile = (props: Props) => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    console.log(email, name)
    return (
        <div>UserProfile</div>
    )
}

export default UserProfile