import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Home from 'pages';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import {
    ContentLeft, ContentRight, EditProfilContainer, Followers, Header,
    HeaderLeft, HeaderProfil, HeaderRight, HeaderUserProfilMobile,
    HeaderUserProfilMobileComponent, IconUserProfil, ImageProfil, LineUserProfil,
    MenuHeader, MenuList, MenuUserProfil, NameProfil, ProfilContainer,
    ProfilDesktop, StatusAccount, UpdateProfilContainer, UserProfileContainer,
    UserProfileContainerMobile
} from 'components/UserProfile';

import {
    Content, HeaderSetting, MenuSetting, SettingAccountContainer, Title
} from 'components/Profile/settingAccount';

interface UserProfileLayoutProps {
    children: ReactNode;
    mode?: 'profil';
}

const UserProfile: React.FC<UserProfileLayoutProps> = ({ children, mode }) => {
    const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string } | null>(null);
    const [openModalSetting, setOpenModalSetting] = useState(false);
    const [navbarOff, setNavbarOff] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) localStorage.removeItem('user');
        setUser(getUserInfo());
    }, []);

    useEffect(() => {
        if (mode) setNavbarOff(true);
    }, [mode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/auth/login');
    };

    const handleBack = () => {
        setOpenModalSetting(false);
        setNavbarOff(false);
    };
    const handleMenu = () => {
        setNavbarOff(false);
    };

    const renderDesktopSidebar = () => (
        <>
            <ProfilDesktop>
                <ImageProfil src='/icon/user.svg' />
                <div>
                    <b>{user?.name || 'Nama User'}</b>
                    <UpdateProfilContainer>
                        <IconUserProfil src='/icon/bxs--pencil.svg' style={{ width: 15 }} />
                        Ubah Profil
                    </UpdateProfilContainer>
                </div>
            </ProfilDesktop>
            <LineUserProfil />
            {user && (
                <>
                    <MenuUserProfil>
                        <Header>
                            <IconUserProfil src="/icon/fa--user-o.svg" />
                            <span>Akun Saya</span>
                        </Header>
                        <MenuList>
                            <li className="active">Profil</li>
                            <li>Bank & Kartu</li>
                            <li>Alamat</li>
                            <li>Ubah Password</li>
                            <li>Pengaturan Notifikasi</li>
                            <li>Pengaturan Privasi</li>
                        </MenuList>
                    </MenuUserProfil>
                    <MenuUserProfil onClick={handleLogout}>
                        <Header>
                            <IconUserProfil src="/icon/logout.svg" />
                            <span>Logout</span>
                        </Header>
                    </MenuUserProfil>
                </>
            )}
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
                        <IconUserProfil src='/icon/setting.svg' onClick={() => {
                            setOpenModalSetting(true);
                            setNavbarOff(true);
                        }} />
                        <IconUserProfil src='/icon/bx--cart.svg' />
                        <IconUserProfil src='/icon/chat.svg' />
                    </HeaderRight>
                </MenuHeader>
                <HeaderProfil>
                    <div>
                        <IconUserProfil src='/icon/user.svg' style={{ width: 80, borderRadius: '50%' }} />
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
                    router.replace('/user-profile/profil');
                    handleMenu();
                }}>
                    Keamanan & Akun
                    <IconUserProfil src='/icon/arrow-right.svg' />
                </MenuSetting>
                <MenuSetting onClick={handleLogout}>
                    Logout
                </MenuSetting>
            </Content>
        </SettingAccountContainer>
    );

    const renderMobileSettingContent = () => (
        <SettingAccountContainer>
            <HeaderSetting>
                <IconUserProfil src='/icon/arrow-left-red.svg' width={30} onClick={() => router.replace('/user-profile')} />
                Pengaturan Akun
            </HeaderSetting>
            <Content>
                <ContentRight>{children}</ContentRight>
            </Content>
        </SettingAccountContainer>
    );

    return (
        <>
            <Home mode='user-profile' navbarOn={!navbarOff}>
                <UserProfileContainer>
                    <ContentLeft>{renderDesktopSidebar()}</ContentLeft>
                    {mode && <ContentRight>{children}</ContentRight>}
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
