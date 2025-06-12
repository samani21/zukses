// src/pages/index.tsx
import { ButtonSearch, HeaderComponent, IconHeader, ImageUser, InputSearch, Login, Logo, NavbarHeader, SearchComponent, Wrapper } from 'components/HeaderComponent';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

export default function Header() {
    const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string, image?: string } | null>(null);
    const [login, setLogin] = useState<boolean>(false);
    console.log('user', user)
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('user');
        }
        const fetchedUser = getUserInfo();
        setUser(fetchedUser);
    }, []);
    useEffect(() => {
        if (user) {
            setLogin(false)
        } else {
            setLogin(true)
        }
    }, [user]);

    const handleLogin = () => {
        router.push('/auth-old/login')
    }


    return (
        <div>
            <HeaderComponent>
                <NavbarHeader>
                    <Logo src='/logo/logo-white.png' />
                    <SearchComponent>
                        <Wrapper>
                            <InputSearch />
                            <ButtonSearch>
                                <IconHeader src='/icon-old/search.svg' style={{ width: "20px" }} />
                            </ButtonSearch>
                        </Wrapper>
                        {/* <ListHistorySearch>
                            <p>Gps Mini</p>
                            <p>Engsel Meja Lipat Dinding</p>
                            <p>Kemeja Hitam Pria</p>
                            <p>Kacamata Ray Ban Original 100%</p>
                            <p>Bantal Latex Original</p>
                            <p>Mesin Rumah Low Wat</p>
                        </ListHistorySearch> */}
                    </SearchComponent>
                    <IconHeader src='/icon-old/bx--cart.svg' style={{ width: "40px", marginTop: "10px" }} />
                    {
                        login ? (
                            <Login onClick={handleLogin}>
                                Log In
                            </Login>
                        ) : <ImageUser src={user?.image ? user?.image : '/icon-old/user.svg'} style={{ width: "40px" }} onClick={() => router.push('/user-profile/profil')} />
                    }
                </NavbarHeader>
            </HeaderComponent>

        </div>
    );
}
