import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProvidersButtons from '../../components/AuthProviderButton/ProvidersButtons';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { setUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const loginBtn = useRef();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [extraMessage, setExtaMessage] = useState({});
  const pwdMsg = useRef({
    pwdEntered: false,
  });
  const { password, email } = loginData;

  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    if (pwdMsg.current.pwdEntered) return;
    if (password.length > 0) pwdMsg.current.pwdEntered = true;
  }, [password]);

  useEffect(() => {
    if (pwdMsg.current.pwdEntered) {
      if (password.trim().length < 6)
        setExtaMessage((prev) => ({
          ...prev,
          pwd: {
            type: 'error',
            payload: 'Password should be atleast 6 characters.',
          },
        }));
      else
        setExtaMessage((prev) => ({
          ...prev,
          pwd: {
            type: 'success',
            payload: 'Password length is ok.',
          },
        }));
    }
  }, [password]);

  const handleChange = (name) => (event) => {
    const pwdOrCnf =
      name === 'password' || name === 'confirmPassword' ? true : false;
    setLoginData((prev) => ({
      ...prev,
      [name]: pwdOrCnf
        ? event.target.value.trim()
        : event.target.value.trimStart(),
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (password.trim().length < 6) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
          credentials: 'include',
        }
      );
      if (!response.ok)
        throw new Error(JSON.parse(await response.text()).message);
      const { accessToken, currentUser } = await response.json();
      if (accessToken)
        setUser((prev) => ({ ...prev, accessToken, currentUser }));
      setLoading(false);
    } catch (err) {
      setExtaMessage((prev) => ({
        ...prev,
        resErr: {
          type: 'error',
          payload: err.message,
        },
      }));
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading) {
      loginBtn.current.disabled = true;
      document.body.style.cursor = 'wait';
    } else {
      loginBtn.current.disabled = false;
      document.body.style.cursor = 'auto';
    }
  }, [loading]);

  return (
    <div className="mainContent">
      <div className="signupForm">
        <form onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <ProvidersButtons authType="login" />
          <div className="optionLine">or</div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={handleChange('email')}
              id="email"
              type="email"
              name="email"
              required
              placeholder="Email Address"
            />
            <div className={`${extraMessage?.email?.type}`}>
              {extraMessage?.email?.payload}
            </div>
          </div>
          <div className="field">
            <label htmlFor="name">Password</label>
            <input
              value={password}
              onChange={handleChange('password')}
              id="pwd"
              type="password"
              name="password"
              required
              autoComplete="off"
              placeholder="Password"
            />
            <div className={`${extraMessage?.pwd?.type}`}>
              {extraMessage?.pwd?.payload}
            </div>
          </div>
          <div className={`responseError ${extraMessage?.resErr?.type}`}>
            {extraMessage?.resErr?.payload}
          </div>
          <button ref={loginBtn} type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
