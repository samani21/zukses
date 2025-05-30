import styled from "@emotion/styled";

export const UserProfileContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: start;
    gap: 10px;
    padding: 10px 50px;
    @media (max-width: 650px) {
        display: none;
    }
`;
export const UserProfileContainerMobile = styled.div`
    display: none;
    @media (max-width: 650px) {
        display: inline;
    }
`;

export const ImageProfil = styled.img`
    width: 50px;
`;

export const ContentLeft = styled.div`
    width: 300px;
    padding: 20px;
`

export const ContentRight = styled.div`
    width: 100%;
    background: #fff;
    height: 80dvh;
    padding: 20px;
    box-shadow: 0px 0px 3px 0px #0000004b;
`;

export const ProfilDesktop = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
    b{
    font-size: 14px;
    white-space: nowrap;      
    overflow: hidden;    
    text-overflow: ellipsis;
    width: 120px;
    display: inline-block;
}
`;

export const UpdateProfilContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    gap: 5px;
    color: #989898;
    cursor: pointer;
`;

export const LineUserProfil = styled.div`
    width: 100%;
    height: 1px;
    border: 1px  solid #e5e5e5;
    margin-top: 10px;
`

export const IconUserProfil = styled.img`
    
`