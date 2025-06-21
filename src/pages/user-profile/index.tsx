import Header from 'components/Header'
import MobileNavBar from 'components/MobileNavBar'
import SettingsLayout from 'components/userProfile/SettingsLayout'
import React, { useState } from 'react'

const IndexPage = () => {
    const [hideNavber, setHideNavbar] = useState<boolean>(false);

    return (
        <div>
            <div className='hidden md:block'>
                <Header />
            </div>
            <div className="bg-gray-100 min-h-screen font-sans">
                <div className="container mx-auto p-0 md:p-4 md:px-20">
                    <SettingsLayout setHideNavbar={setHideNavbar} />
                </div>
            </div>
            {
                !hideNavber &&
                <div className='md:hidden'>
                    <MobileNavBar />
                </div>
            }
        </div>
    )
}

export default IndexPage
