import React, { useEffect, useRef } from 'react';
import './AppLoading.css';
import appLogo from '../../assets/chatLogo.svg';
import { useAuth } from '../../context/AuthContext';

const AppLoading = () => {
  const progress = useRef([15, 30, 40, 60, 70, 80, 90, 95]);
  const { loading } = useAuth();
  const timers = useRef([]);
  const bar = useRef();
  const appLoading = useRef();

  useEffect(() => {
    if (loading && !timers.current.length) {
      appLoading.current.classList.remove('hide');
      bar.current.style.width = `${5}%`;
      for (let i = 0; i < progress.current.length; i++) {
        const randNo =
          i === 0
            ? Math.floor(10 + Math.random() * (progress.current[i] - 10))
            : Math.floor(
                progress.current[i - 1] +
                  Math.random() *
                    (progress.current[i] - progress.current[i - 1] + 1)
              );

        timers.current.push(
          setTimeout(() => {
            bar.current.style.width = `${randNo}%`;
          }, 1.5 * randNo * 100)
        );
      }
    }
    if (!loading) {
      timers.current.forEach((elem) => {
        clearTimeout(elem);
      });
      bar.current.style.transition = `width 190ms ease-in-out`;
      setTimeout(() => {
        bar.current.style.width = `100%`;
      }, 0);
      setTimeout(() => {
        appLoading.current.classList.add('hide');
      }, 200);
    }
  }, [loading]);

  return (
    <div ref={appLoading} className="appLoading">
      <div className="loadingInfo">
        <div className="appLogo">
          <img width={'100'} height={'100'} src={appLogo} alt="app logo" />
        </div>
        <span className="appName">Message Bits</span>
        <div className="loadingBar">
          <div ref={bar} className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default AppLoading;
