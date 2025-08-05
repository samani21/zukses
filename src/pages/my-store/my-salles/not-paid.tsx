import React from 'react'
import { MySallesPage } from '.'
import MyStoreLayout from 'pages/layouts/MyStoreLayout'

const NotPaidPage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Belum Bayar'} />
        </MyStoreLayout>
    )
}

export default NotPaidPage