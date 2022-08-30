import { smoothScrollTo } from './smoothScroll';

function smoothScrollToMessage(chatList, prevMsg) {
  console.log(prevMsg);
  console.log(
    chatList.scrollTop,
    prevMsg.offsetTop,
    prevMsg.clientHeight,
    chatList.clientHeight
  );
  if (chatList.scrollTop > prevMsg.offsetTop) {
    if (prevMsg.clientHeight < chatList.clientHeight)
      smoothScrollTo({
        top:
          prevMsg.offsetTop -
          chatList.clientHeight / 2 +
          prevMsg.clientHeight / 2,
        duration: 600,
        element: chatList,
      });
    else
      smoothScrollTo({
        top: prevMsg.offsetTop - chatList.clientHeight / 2,
        duration: 600,
        element: chatList,
      });
    setTimeout(() => {
      prevMsg.children[0].classList.add('highlight');
      setTimeout(() => {
        prevMsg.children[0].classList.remove('highlight');
      }, 500);
    }, 600);
  } else {
    smoothScrollTo({
      top:
        prevMsg.offsetTop -
        chatList.clientHeight / 2 +
        prevMsg.clientHeight / 2,
      duration: 400,
      element: chatList,
    });
    setTimeout(() => {
      prevMsg.children[0].classList.add('highlight');
      setTimeout(() => {
        prevMsg.children[0].classList.remove('highlight');
      }, 500);
    }, 400);
  }
}

export default smoothScrollToMessage;
