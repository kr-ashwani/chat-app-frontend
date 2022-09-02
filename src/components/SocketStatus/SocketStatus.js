import { CircularProgress } from '@mui/material';
import React from 'react';
import { useState, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import './SocketStatus.css';
import { useEffect } from 'react';

const SocketStatus = () => {
  const { socket } = useSocket();
  const [socketCurrentStatus, setSocketCurrentStatus] = useState(false);
  const statusElem = useRef();
  const statusMainElem = useRef();
  const clearTimer = useRef();

  socket.on('connect', () => {
    setSocketCurrentStatus(socket.connected);
  });

  socket.on('disconnect', () => {
    setSocketCurrentStatus(socket.connected);
  });

  useEffect(() => {
    if (socketCurrentStatus) {
      clearTimer.current = setTimeout(() => {
        statusElem.current && statusElem.current.classList.add('hide');
      }, 800);
    } else {
      statusElem.current && statusElem.current.classList.remove('hide');
    }
    return () => clearTimeout(clearTimer.current);
  }, [socketCurrentStatus]);

  return (
    <div ref={statusMainElem} className="socketStatus">
      <div
        ref={statusElem}
        className={`statusDesc ${socketCurrentStatus ? 'connected' : ''} `}>
        {socketCurrentStatus ? (
          <p>Connected</p>
        ) : (
          <>
            <CircularProgress size="20px" />
            <p>Connecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SocketStatus;
