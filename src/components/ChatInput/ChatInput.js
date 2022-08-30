import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import useChatRoom from '../../hooks/useChatRoom';
import useSelectedChat from '../../hooks/useSelectedChat';
import './ChatInput.css';
import { v4 as uuid } from 'uuid';
import useReply from '../../hooks/useReply';
import useMessage from './../../hooks/useChatRoomMessage';
import uploadFile from './../../utils/uploadFile';

const ChatInput = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const emojiPicker = useRef();
  const emojiIcon = useRef();
  const messageDiv = useRef();
  // const [chatRoomTypingMessage, setChatRoomTypingMessage] = useState([]);
  const pendingMsg = useRef({});
  const pendingChatRoom = useRef([]);
  const { chatRoomMessages, setChatRoomMessages } = useMessage();
  const { newGroupChatInfo, setNewGroupChatInfo } = useChatRoom();
  const createNewGroupChat = useRef(false);
  const scrollMsg = useRef(0);

  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { socket } = useSocket();
  const { setChatRooms } = useChatRoom();
  let container = useRef();

  const { setRepliedMessage, repliedMessage } = useReply();

  const multipleFileNewRoom = useRef({});

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

  //  adjusting input width
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
      chatDiv.style.width = `${currentChatWidth - 25 - 48 - 20 - 30}px`;
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

  //message is sent to server and local message and chatRoom State is updated
  function sendMessage({ msgType = null, fileMessage = null }) {
    if (!fileMessage) messageDiv.current.focus();
    if (!fileMessage)
      if (!message.length || (message.length && !message.trim().length)) {
        setMessage('');
        messageDiv.current.innerText = '';
        return;
      }

    if (!selectedChat) return;
    console.log('message sent : ', message);

    const messageID = uuid();
    // const chatRoomID = uuid();
    const createdAt = new Date().getTime();

    let msgInfoTime = null;
    const messageData = {
      senderID: currentUser._id,
      senderPhotoUrl: currentUser.photoUrl,
      senderName: currentUser.firstName + ' ' + currentUser.lastName,
      message: fileMessage ? '' : message.trim(),
      messageType: fileMessage
        ? `file-${fileMessage.type}`
        : msgType
        ? 'information'
        : 'text',
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
      repliedMessageID: repliedMessage.messageID,
      repliedMessage: repliedMessage.messageID && repliedMessage,
      fileInfo: fileMessage
        ? {
            fileName: fileMessage.name,
            size: fileMessage.size,
            type: fileMessage.type,
            url: '',
            extension: fileMessage.name.split('.').pop(),
          }
        : null,
      fileProgressInfo: fileMessage
        ? ['video', 'image'].includes(fileMessage.type.split('/')[0])
          ? null
          : {
              loaded: 0,
              total: fileMessage.size,
              remainingBytes: fileMessage.size,
              fileSent: 0,
              rateUnit: '0b/s',
              rate: '0',
            }
        : null,
    };

    if (fileMessage) {
      uploadFile(
        fileMessage,
        updateLinkMessage,
        null,
        [`${messageData.chatRoomID}/${messageData.messageID}`],
        updateProgressMessage
      );
      scrollMsg.current = 1;
    }

    if (selectedChat.chatRoomID) {
      const chatMsgsArr = Object.values(
        chatRoomMessages[selectedChat.chatRoomID]
      );
      const prevMsg = chatMsgsArr[chatMsgsArr.length - 1];
      const check =
        messageData.createdAt - prevMsg.createdAt > 24 * 60 * 60 * 1000
          ? true
          : new Date(messageData.createdAt).getDay() !==
            new Date(prevMsg.createdAt).getDay()
          ? true
          : false;

      if (check)
        msgInfoTime = {
          senderID: currentUser._id,
          senderPhotoUrl: currentUser.photoUrl,
          senderName: currentUser.firstName + ' ' + currentUser.lastName,
          message: '',
          messageType: 'information',
          createdAt: createdAt - 2,
          updatedAt: createdAt - 2,
          showUserInfo: false,
          messageID: uuid(),
          chatRoomID: selectedChat.chatRoomID,
          messageStatus: {
            seen: false,
            sent: false,
            delivered: false,
          },
          repliedMessageID: null,
          fileInfo: null,
          fileProgressInfo: null,
        };
      if (!pendingMsg.current[selectedChat.chatRoomID])
        pendingMsg.current[selectedChat.chatRoomID] = [];

      if (check) pendingMsg.current[selectedChat.chatRoomID].push(msgInfoTime);
      else pendingMsg.current[selectedChat.chatRoomID].push(messageData);

      if (socket.connected) {
        if (
          !messageData.fileInfo ||
          msgInfoTime?.messageType === 'information'
        ) {
          if (pendingMsg.current[selectedChat.chatRoomID].length === 1) {
            socket.emit('online:message', {
              messageData: pendingMsg.current[selectedChat.chatRoomID][0],
            });
          }
        }
      }

      if (check) pendingMsg.current[selectedChat.chatRoomID].push(messageData);
    } else {
      msgInfoTime = {
        senderID: currentUser._id,
        senderPhotoUrl: currentUser.photoUrl,
        senderName: currentUser.firstName + ' ' + currentUser.lastName,
        message: '',
        messageType: 'information',
        createdAt: createdAt - 2,
        updatedAt: createdAt - 2,
        showUserInfo: false,
        messageID: uuid(),
        chatRoomID: messageData.chatRoomID,
        messageStatus: {
          seen: false,
          sent: false,
          delivered: false,
        },
        repliedMessageID: null,
        fileInfo: null,
        fileProgressInfo: null,
      };

      socket.emit('chatRoom:create', {
        lastMessage: 'time',
        lastMessageType: 'information',
        lastMessageID: msgInfoTime.messageID,
        updatedAt: createdAt - 2,
        createdAt: createdAt - 2,
        chatRoomID: messageData.chatRoomID,
        lastMessageTimestamp: createdAt - 2,
        participants: selectedChat.selectedUserID
          ? [currentUser._id, selectedChat.selectedUserID]
          : newGroupChatInfo.participants,
        messageData,
        msgInfoTime,
        groupChatPicture: newGroupChatInfo.groupChatName
          ? newGroupChatInfo.groupChatPicture
          : '',
        groupChatName: newGroupChatInfo.groupChatName
          ? newGroupChatInfo.groupChatName
          : '',
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
            lastMessage: fileMessage ? fileMessage.name : message.trim(),
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
        if (msgInfoTime)
          return {
            ...prev,
            [selectedChat.chatRoomID]: {
              ...messageListClone,
              [msgInfoTime.messageID]: msgInfoTime,
              [messageID]: messageData,
            },
          };
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
        lastMessage: fileMessage ? fileMessage.name : message.trim(),
        lastMessageType: messageData.messageType,
        lastMessageID: messageID,
        updatedAt: createdAt,
        createdAt,
        chatRoomID: messageData.chatRoomID,
        participants: selectedChat.selectedUserID
          ? [currentUser._id, selectedChat.selectedUserID]
          : newGroupChatInfo.participants,

        groupChatPicture: newGroupChatInfo.groupChatName
          ? newGroupChatInfo.groupChatPicture
          : '',
        groupChatName: newGroupChatInfo.groupChatName
          ? newGroupChatInfo.groupChatName
          : '',
      };
      setChatRooms((prev) => {
        return {
          ...prev,
          [messageData.chatRoomID]: chatRoomData,
        };
      });

      setChatRoomMessages((prev) => ({
        ...prev,
        [messageData.chatRoomID]: {
          [msgInfoTime.messageID]: msgInfoTime,
          [messageID]: messageData,
        },
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

    if (!fileMessage) {
      setMessage('');
      messageDiv.current.innerText = '';
      setNewGroupChatInfo({
        groupChatName: '',
        groupChatPicture: '',
        participants: [],
      });
    }
    //chatList scroll back to normal
    const chatList = document.getElementsByClassName('chatList')[0];
    const msgelem = document.getElementsByClassName('msgReplyPreview')[0];

    if (repliedMessage.messageID) {
      if (msgelem && chatList) {
        // chatList.scrollTop -= msgelem.clientHeight;
        chatList.style.setProperty('height', '100%');
        chatList.style.transform = `translateY(0)`;
        msgelem.style.transform = 'translateY(0%)';
      }
      setTimeout(() => {
        setRepliedMessage({
          message: '',
          senderID: '',
          messageType: '',
          messageID: null,
          chatRoomID: null,
          senderName: '',
          senderPhotoUrl: '',
          fileInfo: null,
        });
      }, 510);
    }
    messageDiv.current.focus();
  }

  useEffect(() => {
    function sendNewMessage({ messageData, msgInfoTime }) {
      pendingChatRoom.current = pendingChatRoom.current.filter(
        (elem) => elem !== messageData.chatRoomID
      );
      pendingMsg.current[messageData.chatRoomID].push(messageData);
      socket.emit('message:create', {
        messageData: msgInfoTime,
        checkPending: true,
      });
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
        if (!messageData.fileInfo)
          socket.emit('message:create', { messageData, checkPending: true });
        else if (messageData.fileInfo.url)
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

  useEffect(() => {
    if (!newGroupChatInfo.groupChatName) return;
    setMessage(
      `${currentUser.firstName} ${currentUser.lastName} created the group.`
    );
    setSelectedChat({
      firstName: 'group',
      lastName: 'chat',
      photoUrl: 'groupChat',
      selectedUserID: null,
    });
    createNewGroupChat.current = true;
  }, [newGroupChatInfo, setMessage, setSelectedChat, currentUser]);

  useEffect(() => {
    if (createNewGroupChat.current) {
      sendMessage({ msgType: 'information' });
      createNewGroupChat.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useEffect(() => {
    document.getElementsByTagName('body')[0].addEventListener('click', unSub);

    function unSub(e) {
      if (document.getElementsByClassName('attachment')[0].contains(e.target)) {
        if (container.current.contains(e.target))
          container.current.classList.add('show');
      } else container.current.classList.remove('show');
    }

    return () => {
      document
        .getElementsByTagName('body')[0]
        .removeEventListener('click', unSub);
    };
  }, []);

  function updateLinkMessage({ fileID, fileUrl }) {
    const chatRoomID = fileID.split('/')[0];
    const messageID = fileID.split('/')[1];

    setChatRoomMessages((prev) => {
      const prevMsg = prev[chatRoomID][messageID];
      prevMsg.fileInfo.url = fileUrl;
      return { ...prev };
    });
    let i;
    for (i = 0; i < pendingMsg.current[chatRoomID].length; i++) {
      if (pendingMsg.current[chatRoomID][i].messageID === messageID) {
        pendingMsg.current[chatRoomID][i].fileInfo.url = fileUrl;
        break;
      }
    }
    if (i === 0) {
      const messageData = pendingMsg.current[chatRoomID][0];
      socket.emit('message:create', { messageData, checkPending: true });
      pendingMsg.current[chatRoomID].shift();
    }
  }

  function updateProgressMessage(progressInfo) {
    const chatRoomID = progressInfo.fileID.split('/')[0];
    const messageID = progressInfo.fileID.split('/')[1];

    setChatRoomMessages((prev) => {
      const prevMsg = prev[chatRoomID][messageID];
      if (!prevMsg.fileProgressInfo) return prev;
      prevMsg.fileProgressInfo.loaded = progressInfo.loaded;
      prevMsg.fileProgressInfo.fileSent = progressInfo.fileSent;
      prevMsg.fileProgressInfo.remainingBytes = progressInfo.remainingBytes;
      prevMsg.fileProgressInfo.rateUnit = progressInfo.rateUnit;
      prevMsg.fileProgressInfo.rate = Math.round(progressInfo.rate);
      return { ...prev };
    });
  }

  useEffect(() => {
    if (scrollMsg.current) {
      const chatList = document.getElementsByClassName('chatList')[0];
      chatList.style.scrollBehavior = 'smooth';
      chatList.scrollTop = chatList.scrollHeight;
      chatList.style.scrollBehavior = 'auto';
      scrollMsg.current = 0;
    }
  }, [chatRoomMessages]);

  useEffect(() => {
    if (!multipleFileNewRoom.current.files) return;

    multipleFileNewRoom.current.files.forEach((elem, id) => {
      if (id === 0) return;
      if (elem.size / (1024 * 1024) <= process.env.REACT_APP_MAX_FILE_SIZE)
        sendMessage({ fileMessage: elem });
      else alert('file size should be less than 10MB');
    });
    multipleFileNewRoom.current = {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, chatRoomMessages]);

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
      <div
        className="attachment"
        onClick={(e) => {
          container.current.classList.toggle('show');
        }}>
        <div className="attachment-list" ref={container}>
          <div className="attachment-item">
            <input
              type="file"
              accept="video/*,image/*"
              multiple
              onChange={(e) => {
                if (
                  e.target.files[0].size / (1024 * 1024) <=
                  process.env.REACT_APP_MAX_FILE_SIZE
                )
                  sendMessage({ fileMessage: e.target.files[0] });
                else alert('file size should be less than 10MB');
                multipleFileNewRoom.current = {
                  files: Array.from(e.target.files),
                };
                container.current.classList.remove('show');
              }}
            />
            <span className="material-icons">collections</span>
            <p>Photos and videos</p>
          </div>
          <div className="attachment-item">
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (
                  e.target.files[0].size / (1024 * 1024) <=
                  process.env.REACT_APP_MAX_FILE_SIZE
                )
                  sendMessage({ fileMessage: e.target.files[0] });
                else alert('file size should be less than 10MB');
                multipleFileNewRoom.current = {
                  files: Array.from(e.target.files),
                };
                container.current.classList.remove('show');
              }}
            />
            <span className="material-icons">description</span>
            <p>Documents</p>
          </div>
        </div>

        <span data-testid="clip" data-icon="clip">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path>
          </svg>
        </span>
      </div>

      <div className="chatToSend">
        <div className="inputTitle" onClick={() => messageDiv.current.focus()}>
          Type a message
        </div>
        <div
          ref={messageDiv}
          className="inputMessage"
          contentEditable="true"
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
