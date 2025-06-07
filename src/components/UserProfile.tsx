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
    height: 50px;
    border-radius: 50px;
`;

export const ContentLeft = styled.div`
    width: 300px;
    padding: 20px;
`

export const ContentRight = styled.div`
    width: 100%;
    background: #fff;
    padding: 20px;
    height: 85dvh;
    box-shadow: 0px 0px 3px 0px #0000004b;
    overflow: auto;
    &::-webkit-scrollbar{
      display: none;
    }
    @media (max-width: 1160px) {
      padding: 10px;
    }
    @media (max-width: 650px) {
       height: auto;
       box-shadow: none;
    }
`;
export const ContentRightNoCard = styled.div`
    width: 100%;
    @media (max-width: 1160px) {
      padding: 10px;
    }
    @media (max-width: 650px) {
       height: auto;
       box-shadow: none;
    }
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
    cursor: pointer;
`
export const ImageProfile = styled.img`
  cursor: pointer;
  height: 80px;
  width: 80px;

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
  cursor: pointer;
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


export const HeaderUserProfilMobileComponent = styled.div`
  background-image: url('/image/batik.png');
  background-size: 100px;
  height: 160px;
`;

export const HeaderUserProfilMobile = styled.div`
  background: radial-gradient(circle,rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0) 20%, #ca264c 80%);
  height: 160px;
  padding: 10px 0px;
`;

export const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-top-right-radius: 30px ;
  border-bottom-right-radius: 30px ;
  height: 40px;
  padding: 10px;
`;

export const HeaderRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: start;
  gap: 10px;
  padding: 10px;
  height: 40px;
`;

export const HeaderProfil = styled.div`
  padding: 10px;
  display: flex;
  justify-content: left;
  align-items: start;
  gap: 20px;
  margin-top: 10px;
`;

export const EditProfilContainer = styled.div`
  position: relative;
  z-index: 2;
  background: #00000082;
  padding: 10px;
  border-radius: 50%;
  bottom: 45px;
  left: 50px;
  width: 35px;
`;


export const ProfilContainer = styled.div`  
  margin-top: 10px;
`;


export const NameProfil = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: white;
  display: flex;
  justify-content: left;
  align-items: center;
`;

export const StatusAccount = styled.div`
  background: #fff;
  color: var(--primary-color);
  font-size: 16px;
  margin-left: 10px;
  padding: 0px 5px;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Followers = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  color: #fff;
  gap: 10px;
`;