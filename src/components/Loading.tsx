import styled from '@emotion/styled'
import React from 'react'

const LoadingContainer = styled.div`
    position: absolute;
    height: 100dvh;
    background: #0000003e;
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
    width: 150px;
`;

const Loading = () => {

    return (
        <LoadingContainer>
            <ImageLoading src='/loading/fade-stagger-squares.svg' />
        </LoadingContainer>
    )
}

export default Loading;
