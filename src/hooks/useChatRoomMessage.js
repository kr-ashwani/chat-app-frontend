import { useContext } from 'react';
import { ChatRoomMessageContext } from '../context/chatRoomMessageContext';

function useMessage() {
  return useContext(ChatRoomMessageContext);
}

export default useMessage;
