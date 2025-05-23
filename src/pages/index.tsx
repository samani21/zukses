// src/pages/index.tsx
import { useEffect, useState } from 'react';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

export default function Home() {
  const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string } | null>(null);
  const [login, setLogin] = useState<boolean>(false)
  useEffect(() => {
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
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogin(true)
  }
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/login'
  }

  return (
    <div>
      {
        login ?
          <div onClick={handleLogin}>
            login
          </div> :
          <div onClick={handleLogout}>
            Logout
          </div>
      }
    </div>
  );
}
