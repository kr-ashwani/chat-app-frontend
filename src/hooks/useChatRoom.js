import { useContext } from 'react';
import { ChatRoomContext } from '../context/chatRoomContext';

function useChatRoom() {
  return useContext(ChatRoomContext);
}

export default useChatRoom;
