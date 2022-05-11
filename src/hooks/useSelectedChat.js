import { useContext } from 'react';
import { SelectedChatContext } from '../context/SelectedChatContext';

function useSelectedChat() {
  return useContext(SelectedChatContext);
}

export default useSelectedChat;
