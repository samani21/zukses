import styled from "@emotion/styled";

export const HeaderComponent = styled.div`
    background-image: url('/image/batik.png');
    background-size: 150px;
    font-family: "Roboto", sans-serif;  
`

export const NavbarHeader = styled.nav`
    background: radial-gradient(circle,rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0) 20%, #ca264c 100%);
    padding: 10px 50px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 30px;
    @media (max-width: 650px) {
       padding: 10px;
    }
`

export const Logo = styled.img`
    width: 100px;
    margin-top: 10px;
    @media (max-width: 650px) {
        display: none;
    }
`

export const IconHeader = styled.img`
    width: 30px;
    cursor: pointer;
`;
export const ImageUser = styled.img`
    border-radius: 30px;
    margin-top: 10px;
    height: 40px;
    cursor: pointer;
    @media (max-width: 500px) {
        display: none;
    }
`;

export const Wrapper = styled.div`
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: border 0.2s ease;
    margin-bottom: 10px;
    &:focus-within {
        border: 1px solid #171717;
    }
`;

export const ButtonSearch = styled.button`
    background: var(--primary-color);
    padding: 5px 15px;
    border-radius: 5px;
    border: none;
    color: white;
    cursor: pointer;
`;

export const InputSearch = styled.input`
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
`;

export const Login = styled.div`
    font-weight: bold;
    color: #fff;
    font-size: 14px;
    width: 70px;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
    @media (max-width: 500px) {
        display: none;
    }
`;

export const UserMenuWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const UserIcon = styled.img`
    width: 45px;
    cursor: pointer;
`;

export const DropdownMenu = styled.div`
    position: absolute;
    top: 60px;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    min-width: 120px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 100;
`;

export const MenuItem = styled.div`
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    &:hover {
        background-color: #f5f5f5;
    }
`;


export const SearchComponent = styled.div`
    width:100%; 
`;

export const ListHistorySearch = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 14px;
    @media (max-width: 1200px) {
        display: none;
    } 
`;