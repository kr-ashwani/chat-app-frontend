import React, { useState, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState({ currentUser: null, accessToken: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserInfo() {
      if (user.currentUser) return;
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/auth/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (!response.ok) return;
      const { currentUser } = await response.json();
      setUser((prev) => ({ ...prev, currentUser }));
    }
    if (user.accessToken) getUserInfo();
  }, [user]);

  useEffect(() => {
    async function getAccessToken() {
      setLoading(true);
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/auth/refresh`,
        {
          credentials: 'include',
          headers: {
            'x-tokenReqTime': Date.now(),
          },
        }
      );
      if (!res.ok) return;
      const { accessToken, currentUser } = await res.json();
      if (accessToken)
        setUser((prev) => ({ ...prev, accessToken, currentUser }));
      setLoading(false);
    }
    getAccessToken();
  }, []);

  const value = {
    ...user,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth, AuthProvider };
