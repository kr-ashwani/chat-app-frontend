import React, { useEffect, useRef } from 'react';
import './ChatScreen.css';
import useSelectedChat from '../../hooks/useSelectedChat';
import { useSocket } from '../../context/SocketContext';
import TextMessage from '../TextMessage/TextMessage';
import { useAuth } from '../../context/AuthContext';
import useReply from '../../hooks/useReply';
import animateAutoHeight from '../../utils/animateAutoHeight';
import UserAvatar from '../UserAvatar/UserAvatar';
import { smoothScrollTo } from '../../utils/smoothScroll';
import chatListReplyScroll from '../../utils/chatListReplyScroll';

const ChatScreen = ({ chatRoomMessages, setChatRoomMessages }) => {
  const { selectedChat } = useSelectedChat();
  const { socket } = useSocket();
  const { currentUser } = useAuth();
  const scrollMsg = useRef(0);

  const { repliedMessage, setRepliedMessage } = useReply();

  useEffect(() => {
    console.log('selectedChat : ', selectedChat);
    if (selectedChat)
      document.getElementsByClassName('welcomeScreen')[0].classList.add('hide');
  }, [selectedChat]);

  // useEffect(() => {
  //   const chatList = document.getElementsByClassName('chatList')[0];
  //   chatList.style.scrollBehavior = 'smooth';
  //   chatList.scrollTop = chatList.scrollHeight;
  //   chatList.style.scrollBehavior = 'auto';
  // }, [chatRoomMessages]);

  function iOS() {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  }

  useEffect(() => {
    const chatList = document.getElementsByClassName('chatList')[0];
    if (iOS()) {
      setTimeout(() => {
        chatList.style.scrollBehavior = 'auto';
        chatList.scrollTop = chatList.scrollHeight;
      }, 0);
    } else {
      chatList.style.scrollBehavior = 'auto';
      chatList.scrollTop = chatList.scrollHeight;
    }
  }, [selectedChat]);

  // socket realtime new message

  useEffect(() => {
    function newMessage({ newMsg, lastMsg }) {
      setChatRoomMessages((prev) => {
        const prevMsgs = prev[newMsg?.chatRoomID];
        console.log('previous msg', prevMsgs);
        console.log('last msg', lastMsg);
        if (prevMsgs && lastMsg && prevMsgs[lastMsg.messageID]?.showUserInfo)
          prevMsgs[lastMsg.messageID].showUserInfo = lastMsg.showUserInfo;

        if (newMsg.senderID === currentUser._id) scrollMsg.current = 1;
        else {
          const chatList = document.getElementsByClassName('chatList')[0];
          if (
            chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight <
            600
          ) {
            scrollMsg.current = 1;
          }
        }

        if (!prevMsgs)
          return {
            ...prev,
            [newMsg.chatRoomID]: { [newMsg.messageID]: newMsg },
          };
        return {
          ...prev,
          [newMsg.chatRoomID]: { ...prevMsgs, [newMsg.messageID]: newMsg },
        };
      });

      if (currentUser._id !== newMsg.senderID)
        setTimeout(() => {
          socket.emit('message:received', {
            messageID: newMsg.messageID,
            senderID: newMsg.senderID,
            chatRoomID: newMsg.chatRoomID,
          });
        }, 100);

      if (currentUser._id !== newMsg.senderID)
        if (selectedChat?.chatRoomID === newMsg.chatRoomID)
          setTimeout(() => {
            socket.emit('message:seen', {
              messageID: newMsg.messageID,
              senderID: newMsg.senderID,
              chatRoomID: newMsg.chatRoomID,
            });
          }, 200);
    }

    socket.on('DB:message:create', newMessage);

    return () => socket.off('DB:message:create', newMessage);
  }, [socket, setChatRoomMessages, currentUser, selectedChat]);

  useEffect(() => {
    if (scrollMsg.current) {
      const chatList = document.getElementsByClassName('chatList')[0];
      chatList.style.scrollBehavior = 'smooth';
      chatList.scrollTop = chatList.scrollHeight;
      chatList.style.scrollBehavior = 'auto';
      scrollMsg.current = 0;
    }
  }, [chatRoomMessages]);

  // message seen logic

  useEffect(() => {
    if (!selectedChat?.chatRoomID) return;
    const msgs = Object.values(chatRoomMessages[selectedChat.chatRoomID]);
    msgs.forEach((elem) => {
      if (currentUser._id !== elem.senderID)
        if (!elem.messageStatus.seen)
          socket.emit('message:seen', {
            messageID: elem.messageID,
            senderID: elem.senderID,
            chatRoomID: elem.chatRoomID,
          });
    });
  }, [selectedChat, chatRoomMessages, socket, currentUser]);

  useEffect(() => {
    function messageSent({ chatRoomID, messageID }) {
      setChatRoomMessages((prev) => {
        const prevMessage = prev[chatRoomID][messageID];
        if (prevMessage.messageID === messageID)
          prevMessage.messageStatus.sent = true;

        return { ...prev, [chatRoomID]: prev[chatRoomID] };
      });
      socket.emit('message:sent', { messageID });
    }
    socket.on('message:sent', messageSent);
    return () => socket.off('message:sent', messageSent);
  }, [socket, setChatRoomMessages]);

  // message received logic

  useEffect(() => {
    function messageSent({ chatRoomID, messageID }) {
      if (!chatRoomMessages[chatRoomID][messageID]?.messageStatus.delivered)
        setChatRoomMessages((prev) => {
          const prevMessage = prev[chatRoomID][messageID];
          prevMessage.messageStatus.delivered = true;
          return { ...prev, [chatRoomID]: prev[chatRoomID] };
        });
    }
    socket.on('message:delivered', messageSent);
    return () => socket.off('message:delivered', messageSent);
  }, [socket, setChatRoomMessages, chatRoomMessages]);

  useEffect(() => {
    function messageSeen({ chatRoomID, messageID }) {
      if (!chatRoomMessages[chatRoomID][messageID]?.messageStatus.seen)
        setChatRoomMessages((prev) => {
          const prevMessage = prev[chatRoomID][messageID];
          prevMessage.messageStatus.seen = true;
          return { ...prev, [chatRoomID]: prev[chatRoomID] };
        });
    }
    socket.on('message:seen', messageSeen);
    return () => socket.off('message:seen', messageSeen);
  }, [socket, setChatRoomMessages, chatRoomMessages]);

  useEffect(() => {
    Array.from(
      document.getElementsByClassName('chatRoomList')[0].children
    ).forEach((elem) => elem.classList.remove('selected'));
    if (!selectedChat?.chatRoomID) return;
    if (document.getElementsByClassName(selectedChat.chatRoomID)[0]?.classList)
      document
        .getElementsByClassName(selectedChat.chatRoomID)[0]
        .classList.add('selected');
  }, [selectedChat]);

  function noReply() {
    const scroll = animateAutoHeight(
      document.getElementsByClassName('replyMessagePreview')[0],
      'hide',
      'hide'
    );
    const chatList = document.getElementsByClassName('chatList')[0];
    if (iOS())
      if (
        chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight >
        -1 * scroll
      )
        chatList.scrollTo({
          top: chatList.scrollTop + scroll,
          behavior: 'smooth',
        });
      else
        chatList.scrollTo({
          top: chatList.scrollHeight,
          behavior: 'smooth',
        });
    else
      smoothScrollTo({
        top: chatList.scrollTop + scroll,
        duration: 200,
        element: chatList,
      });
    setTimeout(() => {
      setRepliedMessage({
        replied: false,
        message: null,
        replierID: '',
        messageType: '',
        messageThumbnail: '',
        messageID: '',
        userName: '',
        userID: '',
        userPhotoUrl: '',
      });
    }, 200);
  }
  useEffect(() => {
    if (repliedMessage.message) {
      document.getElementsByClassName('inputMessage')[0].focus();
      const scroll = animateAutoHeight(
        document.getElementsByClassName('replyMessagePreview')[0],
        'hide',
        'show'
      );
      const chatList = document.getElementsByClassName('chatList')[0];

      chatListReplyScroll(chatList, scroll);
    }
  }, [repliedMessage.message]);

  useEffect(() => {
    setRepliedMessage({
      replied: false,
      message: null,
      messageType: '',
      replierID: '',
      messageThumbnail: '',
      messageID: '',
      userName: '',
      userID: '',
      userPhotoUrl: '',
    });
  }, [selectedChat, setRepliedMessage]);

  return (
    <>
      <div className="viewChat">
        <div className="initialSpace"></div>
        <div className="chatList">
          {chatRoomMessages[selectedChat?.chatRoomID] ? (
            Object.entries(chatRoomMessages[selectedChat.chatRoomID]).map(
              (element) => {
                return <TextMessage message={element[1]} key={element[0]} />;
              }
            )
          ) : (
            <></>
          )}
        </div>
        <div className="replyMessagePreview hide">
          {repliedMessage.message === null ? (
            <></>
          ) : (
            <div className="msgReplyPreview">
              <div className="msgPreview">
                <span>
                  <UserAvatar
                    imgSrc={repliedMessage.userPhotoUrl}
                    size="25px"
                  />
                  <p>
                    {currentUser._id === repliedMessage.userID
                      ? 'You'
                      : repliedMessage.userName}
                  </p>
                </span>
                <span className="repMsg">
                  <p>{repliedMessage.message}</p>
                </span>
              </div>
              <div className="closeReply" onClick={noReply}>
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24">
                  <path d="m19.1 17.2-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatScreen;
