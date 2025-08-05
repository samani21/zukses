import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'
import { MySallesPage } from '.'

const CanclePage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Dibatalkan'} />
        </MyStoreLayout>
    )
}

export default CanclePage