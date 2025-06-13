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
const LoadingContent = styled.div`
   width: 200px;
   height: 130px;
   border-radius: 10px;
   display: flex;
   justify-content: center;
   align-items: center;
`;

const ImageLoading = styled.img`
    width: 150px;
`;

const Loading = () => {

    return (
        <LoadingContainer>
            <LoadingContent>
                <ImageLoading src='/loading/fade-stagger-circles.svg' />
            </LoadingContent>
        </LoadingContainer>
    )
}

export default Loading;
