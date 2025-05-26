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
    width: 30px;
`

export const MenuWrapper = styled.div`
    color: #656565;
    align-content: center;
    &.active{
        color: var(--primary-color);
    }
`