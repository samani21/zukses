import { ContentLeft, ContentRight, EditProfilContainer, Followers, Header, HeaderLeft, HeaderProfil, HeaderRight, HeaderUserProfilMobile, HeaderUserProfilMobileComponent, IconUserProfil, ImageProfil, LineUserProfil, MenuHeader, MenuList, MenuUserProfil, NameProfil, ProfilContainer, ProfilDesktop, StatusAccount, UpdateProfilContainer, UserProfileContainer, UserProfileContainerMobile } from 'components/UserProfile';
import { useRouter } from 'next/router';
import Home from 'pages'
import React, { ReactNode, useEffect, useState } from 'react'
import { getUserInfo } from 'services/api/redux/action/AuthAction';
interface UserProfileLayoutProps {
    children: ReactNode;
    mode?: 'profil';
}
const UserProfile: React.FC<UserProfileLayoutProps> = ({ children, mode }) => {
    const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string } | null>(null);
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('user');
        }
        const fetchedUser = getUserInfo();
        setUser(fetchedUser);
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/auth/login');

    }
    return (
        <>
            <Home mode='user-profile'>
                <UserProfileContainer>
                    <ContentLeft>
                        <ProfilDesktop>
                            <ImageProfil src='/icon/user.svg' />
                            <div>
                                <b>Nama User adalah dia</b>
                                <UpdateProfilContainer>
                                    <IconUserProfil src='/icon/bxs--pencil.svg' style={{ width: "15px" }} />
                                    Ubah Profil
                                </UpdateProfilContainer>
                            </div>
                        </ProfilDesktop>
                        <LineUserProfil />
                        {
                            user &&
                            <>
                                <MenuUserProfil>
                                    <Header>
                                        <IconUserProfil src="/icon/fa--user-o.svg" alt="User Icon" />
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
                                        <IconUserProfil src="/icon/logout.svg" alt="User Icon" />
                                        <span>Logout</span>
                                    </Header>
                                </MenuUserProfil>

                            </>
                        }
                    </ContentLeft>
                    {
                        mode && <ContentRight>
                            {children}
                        </ContentRight>
                    }
                </UserProfileContainer>
            </Home>
            <UserProfileContainerMobile>
                <HeaderUserProfilMobileComponent>
                    <HeaderUserProfilMobile>
                        <MenuHeader>
                            <HeaderLeft>
                                <IconUserProfil src='/icon/market.svg' width={30} />
                                <p>Toko Saya</p>
                                <IconUserProfil src='/icon/arrow-right.svg' />
                            </HeaderLeft>
                            <HeaderRight>
                                <IconUserProfil src='/icon/setting.svg' />
                                <IconUserProfil src='/icon/bx--cart.svg' />
                                <IconUserProfil src='/icon/chat.svg' />
                            </HeaderRight>
                        </MenuHeader>
                        <HeaderProfil>
                            <div>
                                <IconUserProfil src='/icon/user.svg' style={{ width: "80px", borderRadius: "50%" }} />
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
            </UserProfileContainerMobile>
        </>
    )
}

export default UserProfile