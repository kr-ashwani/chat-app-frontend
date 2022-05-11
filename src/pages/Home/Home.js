import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Home.css';
import UserInfo from '../../components/UserInfo/UserInfo';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="mainContent">
      {currentUser ? (
        <UserInfo />
      ) : (
        <div className="userInfo">
          <h4>Welcome to JWT Authentication.</h4>
          <p style={{ textAlign: 'center' }}>You are guest.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
