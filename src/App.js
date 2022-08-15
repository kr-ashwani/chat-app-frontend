import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthRedirect from './auth/AuthRedirect';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import PrivateRoute from './privateRoute';
import Chat from './pages/Chat/Chat';
import { SelectedChatProvider } from './context/SelectedChatContext';
import { SocketProvider } from './context/SocketContext';
import { ChatRoomProvider } from './context/chatRoomContext';
import AppLoading from './components/AppLoading/AppLoading';
import { ChatRoomMessageProvider } from './context/chatRoomMessageContext';

function App() {
  return (
    <>
      <AppLoading />
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <SocketProvider>
                <ChatRoomProvider>
                  <ChatRoomMessageProvider>
                    <SelectedChatProvider>
                      <Chat />
                    </SelectedChatProvider>
                  </ChatRoomMessageProvider>
                </ChatRoomProvider>
              </SocketProvider>
            </PrivateRoute>
          }></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/authredirect" element={<AuthRedirect />}></Route>
      </Routes>
    </>
  );
}

export default App;
