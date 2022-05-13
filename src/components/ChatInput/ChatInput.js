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
    if (message) {
      document.getElementsByClassName('inputTitle')[0].style.display = 'none';
    } else
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

    const chatRoomUpdatedID = uuid();
    const createdAt = new Date().getTime();

    const messageData = {
      senderID: currentUser._id,
      senderPhotoUrl: currentUser.photoUrl,
      senderName: currentUser.firstName + ' ' + currentUser.lastName,
      message: message.trim(),
      messageType: 'text',
      chatRoomID: selectedChat.chatRoomID,
      chatRoomUpdatedID,
      createdAt,
      receiverID: selectedChat.selectedUserID,
      updatedAt: createdAt,
      showUserInfo: true,
    };
    if (selectedChat.chatRoomID) socket.emit('message:create', { messageData });
    else socket.emit('message:create', { messageData, selectedChat });

    if (selectedChat.chatRoomID) {
      setChatRooms((prev) => {
        const chatRoom = prev[selectedChat.chatRoomID];
        return {
          ...prev,
          [selectedChat.chatRoomID]: {
            ...chatRoom,
            lastMessage: message.trim(),
            lastMessageType: 'text',
            lastMessageTimestamp: createdAt,
            chatRoomUpdatedID,
          },
        };
      });

      //show userInfo logic
      setChatRoomMessages((prev) => {
        const messageListClone = prev[selectedChat.chatRoomID];
        let previousTextMessage = null;

        for (let i = messageListClone.length - 1; i >= 0; i--) {
          if (messageListClone[i].messageType === 'information') continue;
          if (currentUser._id !== messageListClone[i].senderID) break;
          if (messageListClone[i].message) {
            previousTextMessage = messageListClone[i];
            break;
          }
        }
        console.log(previousTextMessage);
        if (previousTextMessage) {
          const currentMessageTime = messageData.createdAt;
          const previousMessageTime = previousTextMessage.createdAt;
          if ((currentMessageTime - previousMessageTime) / (1000 * 60) < 1)
            previousTextMessage.showUserInfo = false;
        }
        return {
          ...prev,
          [selectedChat.chatRoomID]: [...messageListClone, messageData],
        };
      });
    }

    console.log(chatRooms);
    setMessage('');
    messageDiv.current.innerText = '';
  }

  useEffect(() => {
    async function getNewChatRoom(payload) {
      if (payload.error) return console.log(payload.error);
      const { newChatRoom, newMsg, selectedChatRoom } = payload;
      const { _id: chatRoomID } = newChatRoom;
      console.log('PAYLOAD: ', payload);
      setChatRooms((prev) => ({ ...prev, [chatRoomID]: newChatRoom }));
      setChatRoomMessages((prev) => ({
        ...prev,
        [chatRoomID]: [newMsg],
      }));
      setSelectedChat({ ...selectedChatRoom, chatRoomID });
    }
    socket.on('message:create', getNewChatRoom);

    return () => socket.off('message:create', getNewChatRoom);
  }, [socket, setChatRooms, setChatRoomMessages, setSelectedChat]);

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
          onPaste={(e) => pasteInput(e)}></div>
      </div>
      <div className="sendBtn">
        <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
      </div>
    </div>
  );
};

export default ChatInput;
