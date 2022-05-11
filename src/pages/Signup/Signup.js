import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProvidersButtons from '../../components/AuthProviderButton/ProvidersButtons';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const { setUser, currentUser } = useAuth();
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    authProvider: 'emailPassword',
    photoUrl: '',
  });
  const [extraMessage, setExtaMessage] = useState({});
  const pwdMsg = useRef({
    pwdEntered: false,
    cnfPwdEntered: false,
  });

  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  const { firstName, password, confirmPassword } = signupData;

  const randomPhotoUrlString = `${
    ['micah', 'avataaars'][Math.floor(Math.random() * 2)]
  }/${firstName}${Math.floor(Math.random() * 20)}.svg`;
  const handleChange = (name) => (event) => {
    const pwdOrCnf =
      name === 'password' || name === 'confirmPassword' ? true : false;
    setSignupData((prev) => ({
      ...prev,
      [name]: pwdOrCnf
        ? event.target.value.trim()
        : event.target.value.trimStart(),
    }));
  };

  useEffect(() => {
    if (pwdMsg.current.pwdEntered) return;
    if (password.length > 0) pwdMsg.current.pwdEntered = true;
  }, [password]);
  useEffect(() => {
    if (pwdMsg.current.cnfPwdEntered) return;
    if (confirmPassword.length > 0) pwdMsg.current.cnfPwdEntered = true;
  }, [confirmPassword]);

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

      if (pwdMsg.current.cnfPwdEntered) {
        if (password.trim() === confirmPassword.trim()) {
          if (password.trim().length === 0) return;
          setExtaMessage((prev) => ({
            ...prev,
            cnfPwd: {
              type: 'success',
              payload: 'Password matched.',
            },
          }));
        } else
          setExtaMessage((prev) => ({
            ...prev,
            cnfPwd: {
              type: 'error',
              payload: 'Password did not match.',
            },
          }));
      }
    }
  }, [confirmPassword, password]);

  async function handleSubmit(e) {
    e.preventDefault();
    setExtaMessage((prev) => ({ ...prev, resErr: {} }));
    if (password.trim().length < 6) return;
    if (password.trim() !== confirmPassword.trim()) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...signupData,
            photoUrl: `https://avatars.dicebear.com/api/${randomPhotoUrlString}`,
          }),
          credentials: 'include',
        }
      );
      if (!response.ok)
        throw new Error(JSON.parse(await response.text()).message);
      const { accessToken, currentUser } = await response.json();
      if (accessToken) {
        setUser({
          accessToken,
          currentUser,
        });
        // navigate('/');
      }
    } catch (err) {
      setExtaMessage((prev) => ({
        ...prev,
        resErr: {
          payload: err.message,
          type: 'error',
        },
      }));
    }
  }

  return (
    <div className="mainContent">
      <div className="signupForm">
        <form onSubmit={handleSubmit}>
          <h2>Sign up</h2>
          <ProvidersButtons authType="signup" />
          <div className="optionLine">or</div>
          <div className="field">
            <label htmlFor="firstName">Name</label>
            <div className="combinedInput">
              <input
                value={signupData.firstName}
                onChange={handleChange('firstName')}
                id="firstName"
                type="text"
                name="firstName"
                required
                placeholder="First Name"
              />
              <input
                value={signupData.lastName}
                onChange={handleChange('lastName')}
                type="text"
                name="lastName"
                required
                placeholder="Last Name"
              />
            </div>
            <div className={`${extraMessage?.name?.type}`}>
              {extraMessage?.name?.payload}
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              value={signupData.email}
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
            <label htmlFor="pwd">Password</label>
            <input
              value={signupData.password}
              onChange={handleChange('password')}
              id="pwd"
              type="password"
              name="password"
              required
              placeholder="Password"
              autoComplete="off"
            />
            <div className={`${extraMessage?.pwd?.type}`}>
              {extraMessage?.pwd?.payload}
            </div>
          </div>
          <div className="field">
            <label htmlFor="cnfpwd">Confirm Password</label>
            <input
              value={signupData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              id="cnfpwd"
              type="password"
              name="confirm password"
              required
              placeholder="Confirm Password"
              autoComplete="off"
            />
            <div className={`${extraMessage?.cnfPwd?.type}`}>
              {extraMessage?.cnfPwd?.payload}
            </div>
          </div>
          <div className={`responseError ${extraMessage?.resErr?.type}`}>
            {extraMessage?.resErr?.payload}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
