import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'
import { MySallesPage } from '.'

const NotSentPage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Perlu Dikirim'} />
        </MyStoreLayout>
    )
}

export default NotSentPage