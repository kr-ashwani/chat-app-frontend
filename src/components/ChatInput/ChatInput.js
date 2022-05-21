import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import useChatRoom from '../../hooks/useChatRoom';
import useSelectedChat from '../../hooks/useSelectedChat';
import './ChatInput.css';
import { v4 as uuid } from 'uuid';

const ChatInput = ({ setChatRoomMessages }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const emojiPicker = useRef();
  const emojiIcon = useRef();
  const messageDiv = useRef();
  // const [chatRoomTypingMessage, setChatRoomTypingMessage] = useState([]);
  const pendingMsg = useRef({});
  const pendingChatRoom = useRef([]);

  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { socket } = useSocket();
  const { chatRooms, setChatRooms } = useChatRoom();

  //emoji pick logic
  useEffect(() => {
    document
      .getElementsByTagName('body')[0]
      .addEventListener('click', emojiHide);

    function emojiHide(e) {
      if (e.target === emojiIcon.current) return;
      if (!(e.target === emojiPicker.current)) {
        emojiPicker.current.classList.add('emojiHide');
        emojiPicker.current.style.display = 'none';
      }
    }
    function emojiPick(e) {
      messageDiv.current.innerText += e.detail.unicode;
      setMessage(messageDiv.current.innerText);

      //? Set cursor at end of text for content editable div , text area and input field
      window.getSelection().selectAllChildren(messageDiv.current);
      window.getSelection().collapseToEnd();
    }
    const emojiPickerVariable = emojiPicker.current;
    emojiPicker.current.classList.add('emojiHide');
    emojiPicker.current.addEventListener('emoji-click', emojiPick);

    return () => {
      emojiPickerVariable.removeEventListener('emoji-click', emojiPick);
      document
        .getElementsByTagName('body')[0]
        .removeEventListener('click', emojiHide);
    };
  }, []);

  //  setting input width
  useEffect(() => {
    const chatDiv = document.getElementsByClassName('chatToSend')[0];
    chatDiv.style.width = `${chatDiv.offsetWidth}px`;
  }, []);

  // placeholder appear disappear logic
  useEffect(() => {
    // alert(message.trim().length);
    if (message.trim().length)
      document.getElementsByClassName('inputTitle')[0].style.display = 'none';
    else
      document.getElementsByClassName('inputTitle')[0].style.display = 'block';
  }, [message]);

  // width resize logic
  useEffect(() => {
    function setInputWidth() {
      const currentChatWidth =
        document.getElementsByClassName('chatInput')[0].offsetWidth;
      const chatDiv = document.getElementsByClassName('chatToSend')[0];
      chatDiv.style.width = `${currentChatWidth - 25 - 48 - 20}px`;
    }
    window.addEventListener('resize', setInputWidth);
    return () => window.removeEventListener('resize', setInputWidth);
  }, []);

  // paste logic
  function pasteInput(e) {
    console.log(e);
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    e.target.innerText += paste;
    e.target.scrollTop = e.target.scrollHeight;
    setMessage(e.target.innerText);

    //? Set cursor at end of text for content editable div , text area and input field
    window.getSelection().selectAllChildren(messageDiv.current);
    window.getSelection().collapseToEnd();
  }

  //message is sent to server and local message and chatRoom State is changed
  function sendMessage() {
    messageDiv.current.focus();
    if (!message.length || (message.length && !message.trim().length)) {
      setMessage('');
      messageDiv.current.innerText = '';
      return;
    }
    console.log('message sent : ', message);

    const messageID = uuid();
    // const chatRoomID = uuid();
    const createdAt = new Date().getTime();

    const messageData = {
      senderID: currentUser._id,
      senderPhotoUrl: currentUser.photoUrl,
      senderName: currentUser.firstName + ' ' + currentUser.lastName,
      message: message.trim(),
      messageType: 'text',
      createdAt,
      updatedAt: createdAt,
      showUserInfo: true,
      messageID,
      chatRoomID: selectedChat.chatRoomID || uuid(),
      messageStatus: {
        seen: false,
        sent: false,
        delivered: false,
      },
    };

    if (selectedChat.chatRoomID) {
      if (!pendingMsg.current[selectedChat.chatRoomID])
        pendingMsg.current[selectedChat.chatRoomID] = [];

      pendingMsg.current[selectedChat.chatRoomID].push(messageData);

      if (socket.connected)
        if (pendingMsg.current[selectedChat.chatRoomID].length === 1)
          socket.emit('online:message', { messageData });
    } else {
      socket.emit('chatRoom:create', {
        lastMessage: message.trim(),
        lastMessageType: 'text',
        lastMessageID: messageID,
        updatedAt: createdAt,
        createdAt,
        chatRoomID: messageData.chatRoomID,
        lastMessageTimestamp: createdAt,
        participants: [currentUser._id, selectedChat.selectedUserID],
        messageData,
      });

      pendingChatRoom.current.push(messageData.chatRoomID);
      pendingMsg.current[messageData.chatRoomID] = [];
      // pendingMsg.current[messageData.chatRoomID].push(messageData);
    }

    if (selectedChat.chatRoomID) {
      setChatRooms((prev) => {
        const chatRoom = prev[selectedChat.chatRoomID];
        return {
          ...prev,
          [selectedChat.chatRoomID]: {
            ...chatRoom,
            lastMessage: message.trim(),
            lastMessageType: 'text',
            lastMessageID: messageID,
            updatedAt: createdAt,
            lastMessageTimestamp: createdAt,
          },
        };
      });

      //show userInfo logic
      setChatRoomMessages((prev) => {
        const messageListClone = prev[selectedChat.chatRoomID];
        let previousTextMessage = null;
        const msgValue = Object.values(messageListClone);

        for (let i = msgValue.length - 1; i >= 0; i--) {
          if (msgValue[i].messageType === 'information') continue;
          if (currentUser._id !== msgValue[i].senderID) break;
          if (msgValue[i].message) {
            previousTextMessage = msgValue[i];
            break;
          }
        }
        if (previousTextMessage) {
          const currentMessageTime = messageData.createdAt;
          const previousMessageTime = previousTextMessage.createdAt;
          if ((currentMessageTime - previousMessageTime) / (1000 * 60) < 1)
            previousTextMessage.showUserInfo = false;
        }
        return {
          ...prev,
          [selectedChat.chatRoomID]: {
            ...messageListClone,
            [messageID]: messageData,
          },
        };
      });
    } else {
      const chatRoomData = {
        firstName: selectedChat.firstName,
        lastName: selectedChat.lastName,
        photoUrl: selectedChat.photoUrl,
        lastMessageTimestamp: createdAt,
        lastMessage: message.trim(),
        lastMessageType: 'text',
        lastMessageID: messageID,
        updatedAt: createdAt,
        createdAt,
        chatRoomID: messageData.chatRoomID,
        participants: [currentUser._id, selectedChat.selectedUserID],
      };
      setChatRooms((prev) => {
        return {
          ...prev,
          [messageData.chatRoomID]: chatRoomData,
        };
      });

      setChatRoomMessages((prev) => ({
        ...prev,
        [messageData.chatRoomID]: { [messageID]: messageData },
      }));
      setSelectedChat(chatRoomData);

      setTimeout(() => {
        Array.from(
          document.getElementsByClassName('chatRoomList')[0].children
        ).forEach((elem) => elem.classList.remove('selected'));
        if (
          document.getElementsByClassName(messageData.chatRoomID)[0]?.classList
        )
          document
            .getElementsByClassName(messageData.chatRoomID)[0]
            .classList.add('selected');
      }, 200);
    }

    console.log(chatRooms);
    setMessage('');
    messageDiv.current.focus();
    messageDiv.current.innerText = '';
  }

  useEffect(() => {
    function sendNewMessage({ messageData }) {
      pendingChatRoom.current = pendingChatRoom.current.filter(
        (elem) => elem !== messageData.chatRoomID
      );
      socket.emit('message:create', { messageData, checkPending: true });
    }
    socket.on('chatRoom:create:success', sendNewMessage);
    return () => socket.off('chatRoom:create:success', sendNewMessage);
  }, [socket]);

  useEffect(() => {
    function sendMessage({ messageData }) {
      // pendingMsg.current[messageData.chatRoomID] = pendingMsg.current[
      //   messageData.chatRoomID
      // ].filter((elm) => elm.messageID !== messageData.messageID);

      if (messageData)
        socket.emit('message:create', { messageData, checkPending: true });
    }
    socket.on('online:message', sendMessage);
    return () => socket.off('online:message', sendMessage);
  }, [socket]);

  useEffect(() => {
    function checkPending() {
      Object.values(pendingMsg.current).forEach((elem) => {
        const messageData = elem[0];
        if (
          messageData &&
          !pendingChatRoom.current.includes(messageData.chatRoomID)
        )
          socket.emit('message:create', { messageData, checkPending: true });
      });
    }
    socket.on('check:pending', checkPending);
    return () => socket.off('check:pending', checkPending);
  }, [socket]);

  useEffect(() => {
    function sendMorePendingMessages({ chatRoomID, messageID }) {
      if (!pendingMsg.current[chatRoomID]?.length) return;
      if (messageID)
        pendingMsg.current[chatRoomID] = pendingMsg.current[chatRoomID].filter(
          (elem) => elem.messageID !== messageID
        );

      const messageData = pendingMsg.current[chatRoomID][0];
      if (messageData)
        socket.emit('message:create', { messageData, checkPending: true });
    }
    socket.on('chatRoom:send:moreMsgs', sendMorePendingMessages);
    return () => socket.off('chatRoom:send:moreMsgs', sendMorePendingMessages);
  }, [socket]);

  useEffect(() => {}, [socket]);

  useEffect(() => {
    if (message) return;
    const chatList = document.getElementsByClassName('chatList')[0];
    chatList.style.scrollBehavior = 'smooth';
    chatList.scrollTop = chatList.scrollHeight;
    chatList.style.scrollBehavior = 'auto';
  }, [message]);

  function scrollAppOnBlur() {
    // alert('hello');
  }

  return (
    <div className="chatInput">
      <div className="emoji">
        <i
          ref={emojiIcon}
          className="fa-solid fa-face-grin-beam"
          onClick={() => {
            emojiPicker.current.classList.toggle('emojiHide');
            if (emojiPicker.current.classList.contains('emojiHide'))
              emojiPicker.current.style.display = 'none';
            else emojiPicker.current.style.display = 'block';
          }}></i>
        <emoji-picker ref={emojiPicker} className="emojiHide"></emoji-picker>
      </div>
      <div className="chatToSend">
        <div className="inputTitle" onClick={() => messageDiv.current.focus()}>
          Type a message
        </div>
        <div
          ref={messageDiv}
          className="inputMessage"
          contentEditable="true"
          title="Type a message"
          onInput={(e) => setMessage(e.target.innerText)}
          onPaste={(e) => pasteInput(e)}
          onBlur={scrollAppOnBlur}></div>
      </div>
      <div className="sendBtn">
        <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
      </div>
    </div>
  );
};

export default ChatInput;
