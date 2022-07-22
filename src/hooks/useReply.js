import { useContext } from 'react';
import { ReplyMessageContext } from '../context/ReplyMessageContext';

function useReply() {
  return useContext(ReplyMessageContext);
}

export default useReply;
