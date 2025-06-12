import React from 'react'
import { IconNavbar, IconNavbarContainer, MenuWrapper, NavbarBottomContainer } from './NavbarBottomComponent'
import { useRouter } from 'next/router';

const listMenu = [
    {
        title: "Beranda",
        icon: "/icon-old/home.svg",
        icon_active: "/icon-old/home-active.svg",
        url: '/'
    },
    {
        title: "Trending",
        icon: "/icon-old/trending.svg",
        icon_active: "/icon-old/trending-active.svg",
        // url: '/trending'
    },
    {
        title: "Live & Video",
        icon: "/icon-old/live.svg",
        icon_active: "/icon-old/live-active.svg",
        // url: '/live'
    },
    {
        title: "Notifikasi",
        icon: "/icon-old/notification.svg",
        icon_active: "/icon-old/notification-active.svg",
        // url: '/notification'
    },
    {
        title: "Saya",
        icon: "/icon-old/user-profile.svg",
        icon_active: "/icon-old/profil-active.svg",
        url: '/user-profile'
    }
]

const NavbarBottom = () => {
    const router = useRouter();
    return (
        <NavbarBottomContainer>
            {
                listMenu?.map((lm, i) => (
                    <MenuWrapper key={i} onClick={() => {
                        router.push(lm?.url ? lm?.url : '')
                    }} className={router?.pathname === lm?.url ? 'active' : ""}>
                        <IconNavbarContainer>
                            <IconNavbar src={router?.pathname === lm?.url ? lm?.icon_active : lm?.icon} />
                        </IconNavbarContainer>
                        <p>{lm?.title}</p>
                    </MenuWrapper>
                ))
            }
        </NavbarBottomContainer>
    )
}

export default NavbarBottom