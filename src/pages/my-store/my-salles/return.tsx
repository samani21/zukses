import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'
import { MySallesPage } from '.'

const ReturnPage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Pengembalian'} />
        </MyStoreLayout>
    )
}

export default ReturnPage