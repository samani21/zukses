import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'
import { MySallesPage } from '.'

const FinishedPage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Selesai'} />
        </MyStoreLayout>
    )
}

export default FinishedPage