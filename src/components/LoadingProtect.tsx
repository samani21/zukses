import styled from '@emotion/styled'
import React from 'react'

const LoadingContainer = styled.div`
    position: absolute;
    height: 100dvh;
    background: #00000012;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const ImageLoading = styled.img`
    width: 300px;
`;
const ImageLoadingProtect = styled.img`
    width: 150px;
    position: absolute;
`;

const Typograph = styled.p`
    position: absolute;
    margin-top: 300px;
    font-weight: bold;
`

const LoadingProtect = () => {

    return (
        <LoadingContainer>
            <ImageLoading src='/loading/tube-spinner.svg' />
            <ImageLoadingProtect src='/icon/protect-red.svg' />
            <Typograph>
                Memverfikasi Akunmu...
            </Typograph>
        </LoadingContainer >
    )
}

export default LoadingProtect;
