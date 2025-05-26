import React, { useState } from 'react'
import { IconNavbar, IconNavbarContainer, MenuWrapper, NavbarBottomContainer } from './NavbarBottomComponent'
import { useRouter } from 'next/router';

const listMenu = [
    {
        title: "Beranda",
        icon: "/icon/home.svg",
        icon_active: "/icon/home-active.svg",
    },
    {
        title: "Trending",
        icon: "/icon/trending.svg",
        icon_active: "/icon/trending-active.svg",
    },
    {
        title: "Live & Video",
        icon: "/icon/live.svg",
        icon_active: "/icon/live-active.svg",
    },
    {
        title: "Notifikasi",
        icon: "/icon/notification.svg",
        icon_active: "/icon/notification-active.svg",
    },
    {
        title: "Saya",
        icon: "/icon/profil.svg",
        icon_active: "/icon/profil-active.svg",
        url: '/user-profile'
    }
]

const NavbarBottom = () => {
    const [menuActive, setMenuActive] = useState<number>(0);
    const router = useRouter();
    return (
        <NavbarBottomContainer>
            {
                listMenu?.map((lm, i) => (
                    <MenuWrapper key={i} onClick={() => {
                        setMenuActive(i)
                        router.replace(lm?.url ? lm?.url : '')
                    }} className={i === menuActive ? 'active' : ""}>
                        <IconNavbarContainer>
                            <IconNavbar src={i === menuActive ? lm?.icon_active : lm?.icon} />
                        </IconNavbarContainer>
                        {lm?.title}
                    </MenuWrapper>
                ))
            }
        </NavbarBottomContainer>
    )
}

export default NavbarBottom