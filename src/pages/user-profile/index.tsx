import { ContentLeft, ContentRight, IconUserProfil, ImageProfil, LineUserProfil, ProfilDesktop, UpdateProfilContainer, UserProfileContainer, UserProfileContainerMobile } from 'components/UserProfile';
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
                            <p onClick={handleLogout}>
                                Logout
                            </p>
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
                <p onClick={handleLogout}>
                    Logout
                </p>
            </UserProfileContainerMobile>
        </>
    )
}

export default UserProfile