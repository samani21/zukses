import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Home from 'pages';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

import {
    ContentLeft, ContentRight, ContentRightNoCard, EditProfilContainer, Followers, Header,
    HeaderLeft, HeaderProfil, HeaderRight, HeaderUserProfilMobile,
    HeaderUserProfilMobileComponent, IconUserProfil, ImageProfil, ImageProfile, LineUserProfil,
    MenuHeader, MenuList, MenuUserProfil, NameProfil, ProfilContainer,
    ProfilDesktop, StatusAccount, UpdateProfilContainer, UserProfileContainer,
    UserProfileContainerMobile
} from 'components/UserProfile';

import {
    Content, HeaderSetting, MenuSetting, SettingAccountContainer, Title,
    TItleMobile
} from 'components/Profile/settingAccount';

interface UserProfileLayoutProps {
    children: ReactNode;
    mode?: 'profil' | 'address' | 'reset-password' | 'my-orders';
}

// Simple responsive check for server-side + client
const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    return isDesktop;
};

const menus = [
    {
        parent: 'Akun Saya',
        icon: '/icon/fa--user-o.svg',
        url: '/user-profile/profil',
        child: [
            { name: 'Profil', url: '/user-profile/profil' },
            { name: 'Bank & Kartu' },
            {
                name: 'Alamat',
                url: '/user-profile/address'
            },
            { name: 'Ubah Password', url: '/user-profile/reset-password' },
            { name: 'Pengaturan Privasi' },
        ]
    },
    {
        parent: 'Pesanan Saya',
        icon: '/icon/clipboard.svg',
        url: '/user-profile/my-orders'
    },
    {
        parent: 'Notifikasi Saya',
        icon: '/icon/notifcation-menu.svg',
    },
];

const UserProfile: React.FC<UserProfileLayoutProps> = ({ children, mode }) => {
    const [user, setUser] = useState<{ name?: string, image?: string } | null>(null);
    const [openModalSetting, setOpenModalSetting] = useState(false);
    const [navbarOff, setNavbarOff] = useState(false);
    const router = useRouter();
    const isDesktop = useIsDesktop();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('user');
            router.push('/auth/login');
        } else {
            setUser(getUserInfo());
        }
    }, []);

    useEffect(() => {
        if (mode) setNavbarOff(true);
    }, [mode]);

    useEffect(() => {
        if (isDesktop && router.pathname === '/user-profile') {
            router.push('/user-profile/profil');
        }
    }, [isDesktop, router.pathname]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    }, [router]);

    const handleBack = useCallback(() => {
        setOpenModalSetting(false);
        setNavbarOff(false);
    }, []);

    const renderDesktopSidebar = () => (
        <>
            <ProfilDesktop>
                <ImageProfil src={user?.image || '/icon/user.svg'} />
                <div>
                    <b>{user?.name || 'Nama User'}</b>
                    <UpdateProfilContainer>
                        <IconUserProfil src='/icon/bxs--pencil.svg' style={{ width: 15 }} />
                        Ubah Profil
                    </UpdateProfilContainer>
                </div>
            </ProfilDesktop>
            <LineUserProfil />
            <MenuUserProfil>
                {menus.map((m, i) => (
                    <div key={i} onClick={() => m?.url && router.push(m.url)}>
                        <Header>
                            <IconUserProfil src={m.icon} />
                            <span>{m.parent}</span>
                        </Header>
                        <MenuList>
                            {m.child?.map((ch, index) => (
                                <li
                                    key={index}
                                    className={router.pathname === ch?.url ? 'active' : ''}
                                    onClick={() => ch?.url && router.push(ch.url)}
                                >
                                    {ch?.name}
                                </li>
                            ))}
                        </MenuList>
                    </div>
                ))}
                <Header onClick={handleLogout} style={{ marginLeft: "5px" }}>
                    <IconUserProfil src="/icon/logout.svg" width={20} />
                    <span>Logout</span>
                </Header>
            </MenuUserProfil>
        </>
    );

    const renderMobileHeader = () => (
        <HeaderUserProfilMobileComponent>
            <HeaderUserProfilMobile>
                <MenuHeader>
                    <HeaderLeft>
                        <IconUserProfil src='/icon/market.svg' width={30} />
                        <p>Toko Saya</p>
                        <IconUserProfil src='/icon/arrow-right.svg' />
                    </HeaderLeft>
                    <HeaderRight>
                        <IconUserProfil
                            src='/icon/setting.svg'
                            onClick={() => {
                                setOpenModalSetting(true);
                                setNavbarOff(true);
                            }}
                        />
                        <IconUserProfil src='/icon/bx--cart.svg' />
                        <IconUserProfil src='/icon/chat.svg' />
                    </HeaderRight>
                </MenuHeader>
                <HeaderProfil>
                    <div>
                        <ImageProfile
                            src={user?.image || '/icon/user.svg'}
                            style={{ width: 80, borderRadius: '50%' }}
                        />
                        <EditProfilContainer>
                            <IconUserProfil src='/icon/pen.svg' />
                        </EditProfilContainer>
                    </div>
                    <ProfilContainer>
                        <NameProfil>
                            {user?.name}
                            <StatusAccount>
                                Classic
                                <IconUserProfil src='/icon/arrow-right-red.svg' />
                            </StatusAccount>
                        </NameProfil>
                        <Followers>
                            <p><span>43</span> Pengikut</p>
                            <p><span>42</span> Mengikuti</p>
                        </Followers>
                    </ProfilContainer>
                </HeaderProfil>
            </HeaderUserProfilMobile>
        </HeaderUserProfilMobileComponent>
    );

    const renderMobileSettingModal = () => (
        <SettingAccountContainer>
            <HeaderSetting>
                <IconUserProfil src='/icon/arrow-left-red.svg' width={30} onClick={handleBack} />
                Pengaturan Akun
            </HeaderSetting>
            <Content>
                <Title>Akun Saya</Title>
                <MenuSetting onClick={() => {
                    router.push('/user-profile/profil');
                    setNavbarOff(false);
                }}>
                    Keamanan & Akun
                    <IconUserProfil src='/icon/arrow-right.svg' />
                </MenuSetting>
                <MenuSetting onClick={() => {
                    router.push('/user-profile/address');
                    setNavbarOff(false);
                }}>
                    Alamat Saya
                    <IconUserProfil src='/icon/arrow-right.svg' />
                </MenuSetting>
                <MenuSetting onClick={() => {
                    router.push('/user-profile/reset-password');
                    setNavbarOff(false);
                }}>
                    Reset Password
                    <IconUserProfil src='/icon/arrow-right.svg' />
                </MenuSetting>
                <MenuSetting onClick={handleLogout}>
                    Logout
                </MenuSetting>
            </Content>
        </SettingAccountContainer>
    );

    const renderMobileSettingContent = () => (
        <SettingAccountContainer style={{ background: mode === 'reset-password' ? "#fff" : "#e5e5e5" }}>
            {
                mode != "reset-password" && <HeaderSetting>
                    <IconUserProfil src='/icon/arrow-left-red.svg' width={30} onClick={() => router.push('/user-profile')} />
                    {
                        !mode ? "Pengaturan Akun" : mode
                            .split(" ")
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(" ")
                    }
                </HeaderSetting>
            }
            <Content>
                {mode === 'address' ?
                    <TItleMobile>
                        Alamat
                    </TItleMobile> : ''}
                <ContentRight>{children}</ContentRight>
            </Content>
        </SettingAccountContainer>
    );

    return (
        <>
            <Home mode="user-profile" navbarOn={!navbarOff}>
                <UserProfileContainer>
                    <ContentLeft>{renderDesktopSidebar()}</ContentLeft>
                    {mode && mode === 'my-orders' ? <ContentRightNoCard>
                        {children}
                    </ContentRightNoCard> : <ContentRight>{children}</ContentRight>}
                </UserProfileContainer>
            </Home>

            <UserProfileContainerMobile>
                {openModalSetting
                    ? renderMobileSettingModal()
                    : mode
                        ? renderMobileSettingContent()
                        : renderMobileHeader()}
            </UserProfileContainerMobile>
        </>
    );
};

export default UserProfile;
