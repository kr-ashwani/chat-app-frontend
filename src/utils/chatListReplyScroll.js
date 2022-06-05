import { smoothScrollTo } from './smoothScroll';

function step(timestamp, start, previousTimeStamp, chatList) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    chatList.scrollTop += 99999;
  }

  if (elapsed < 200) {
    // Stop the animation after 2 seconds
    previousTimeStamp = timestamp;
    window.requestAnimationFrame((t) =>
      step(t, start, previousTimeStamp, chatList)
    );
  }
}
function chatListReplyScroll(chatList, scroll) {
  if (
    chatList.scrollHeight -
      chatList.scrollTop -
      chatList.clientHeight -
      scroll >
    0
  )
    smoothScrollTo({
      top: chatList.scrollTop + scroll,
      duration: 200,
      element: chatList,
    });
  else {
    let start, previousTimeStamp;
    window.requestAnimationFrame((t) =>
      step(t, start, previousTimeStamp, chatList)
    );
  }
}

export default chatListReplyScroll;
