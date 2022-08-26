import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();
  useEffect(() => {
    console.log('Current user ', currentUser);
  });

  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.0098;
      document
        .getElementsByTagName('html')[0]
        .style.setProperty('--vh', `${vh}px`);
    }
    setVh();

    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return !currentUser ? (
    <nav>
      <div className="navbar">
        <h1>
          <Link to="/">Msg Bits</Link>
        </h1>
        <ul>
          <li>
            <Link to="/login">Log in</Link>
          </li>
          <li>
            <Link to="/signup" className="btn">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  ) : (
    <></>
  );
};
export default Header;
