import styled from "@emotion/styled";

export const NavbarBottomContainer = styled.div`
    position: fixed;
    background: #fff;
    bottom: 0;
    width: 100%;
    display: none;
    gap: 10px;
    padding: 10px;
    @media (max-width: 650px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

export const IconNavbarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const IconNavbar = styled.img`
    width: 25px;
`

export const MenuWrapper = styled.div`
    color: #656565;
    align-content: center;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    p{
        display: none;
    }
    &.active{
        color: var(--primary-color);
        p{
            display: inline;
            
        }
        background: #ca264c27;
        border-radius: 10px;
        padding: 10px;
        width: 50%;
    }
`