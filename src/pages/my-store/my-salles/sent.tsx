import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'
import { MySallesPage } from '.'

const Sentpage = () => {
    return (
        <MyStoreLayout>
            <MySallesPage tab={'Dikirim'} />
        </MyStoreLayout>
    )
}

export default Sentpage