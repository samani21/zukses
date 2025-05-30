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
    @media (max-width: 850px) {
       padding: 10px;
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
export const MenuUserProfil = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: sans-serif;
  margin-top: 10px;
  padding-left: 10px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
    padding-left: 30px;
  li {
    margin-bottom: 8px;
    font-size: 14px;
    color: #555;
    cursor: pointer;

    &.active {
      color: #f44336; /* Warna merah untuk item aktif */
      font-weight: bold;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;
