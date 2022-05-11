import React, { useEffect, useState } from 'react';
import AuthProviderButton from '../../components/AuthProviderButton/AuthProviderButton';
import {
  getFacebookAuthUrl,
  getGithubAuthUrl,
  getGoogleAuthUrl,
} from '../../../src/auth/getAuthUrl';
import googleIcon from '../../assets/google-icon.svg';
import { useAuth } from '../../context/AuthContext';

const ProvidersButtons = ({ authType }) => {
  const { setUser } = useAuth();
  const [serverRes, setServerRes] = useState();

  useEffect(() => {
    if (serverRes?.accessToken) {
      setUser((prev) => ({ ...prev, accessToken: serverRes.accessToken }));
    }
  }, [serverRes, setUser]);

  return (
    <>
      <div className="authIconBox">
        <AuthProviderButton
          url={getGoogleAuthUrl(authType)}
          setServerRes={setServerRes}
          icon={<img src={googleIcon} alt="google" />}></AuthProviderButton>
        <AuthProviderButton
          url={getFacebookAuthUrl(authType)}
          icon={<i className="fa-brands fa-facebook-f"></i>}
          setServerRes={setServerRes}></AuthProviderButton>
        <AuthProviderButton
          url={getGithubAuthUrl(authType)}
          icon={<i className="fa-brands fa-github"></i>}
          setServerRes={setServerRes}></AuthProviderButton>
      </div>
      <div className={`responseError ${serverRes?.error ? 'error' : ''}`}>
        {serverRes?.error}
      </div>
    </>
  );
};

export default ProvidersButtons;
