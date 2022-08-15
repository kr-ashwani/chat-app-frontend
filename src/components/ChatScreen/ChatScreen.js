import React, { useEffect, useRef } from 'react';
import './ChatScreen.css';
import useSelectedChat from '../../hooks/useSelectedChat';
import { useSocket } from '../../context/SocketContext';
import TextMessage from '../TextMessage/TextMessage';
import { useAuth } from '../../context/AuthContext';
import useReply from '../../hooks/useReply';
import UserAvatar from '../UserAvatar/UserAvatar';
import useMessage from './../../hooks/useChatRoomMessage';

const ChatScreen = () => {
  const { selectedChat } = useSelectedChat();
  const { socket } = useSocket();
  const { currentUser } = useAuth();
  const scrollMsg = useRef(0);
  // const prevMsg = useRef(null);
  const { chatRoomMessages, setChatRoomMessages } = useMessage();
  const prevMsg = useRef('');

  const { repliedMessage, setRepliedMessage } = useReply();

  useEffect(() => {
    console.log('selectedChat : ', selectedChat);
    if (selectedChat)
      document.getElementsByClassName('welcomeScreen')[0].classList.add('hide');
  }, [selectedChat]);

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
    const chatList = document.getElementsByClassName('chatList')[0];
    const msgelem = document.getElementsByClassName('msgReplyPreview')[0];

    chatList.scrollTop -= msgelem.clientHeight;
    chatList.style.setProperty('height', '100%');
    chatList.style.transform = `translateY(0)`;
    msgelem.style.transform = 'translateY(0%)';
    setTimeout(() => {
      setRepliedMessage({
        message: '',
        senderID: '',
        messageType: '',
        messageID: null,
        chatRoomID: null,
        senderName: '',
        senderPhotoUrl: '',
      });
    }, 290);
  }
  useEffect(() => {
    if (prevMsg.current === '' && repliedMessage.message) {
      document.getElementsByClassName('inputMessage')[0].focus();
      const chatList = document.getElementsByClassName('chatList')[0];
      const msgelem = document.getElementsByClassName('msgReplyPreview')[0];
      const contentHeight = msgelem.clientHeight;

      setTimeout(() => {
        chatList.style.setProperty('height', `calc(100% - ${contentHeight}px)`);
        chatList.scrollTop += contentHeight;
      }, 300);

      chatList.style.transform = `translateY(${-1 * contentHeight}px)`;
      msgelem.style.transform = 'translateY(-100%)';
    }
    prevMsg.current = repliedMessage.message;
  }, [repliedMessage.messageID, repliedMessage.message]);

  useEffect(() => {
    const chatList = document.getElementsByClassName('chatList')[0];
    const msgelem = document.getElementsByClassName('msgReplyPreview')[0];

    if (msgelem && chatList) {
      chatList.scrollTop -= msgelem.clientHeight;
      chatList.style.setProperty('height', '100%');
      chatList.style.transform = `translateY(0)`;
      msgelem.style.transform = 'translateY(0%)';
    }
    setRepliedMessage({
      message: '',
      senderID: '',
      messageType: '',
      messageID: null,
      chatRoomID: null,
      senderName: '',
      senderPhotoUrl: '',
    });
  }, [selectedChat, setRepliedMessage]);

  return (
    <>
      <div className="viewChat">
        <div className="chatList">
          <div className="initialSpace"></div>
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
        <div className="replyMessagePreview ">
          {!repliedMessage.message ? (
            <></>
          ) : (
            <div className="msgReplyPreview">
              <div className="msgPreview">
                <span>
                  <UserAvatar
                    imgSrc={repliedMessage.senderPhotoUrl}
                    size="25px"
                  />
                  <p>
                    {currentUser._id === repliedMessage.senderID
                      ? 'You'
                      : repliedMessage.senderName}
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
