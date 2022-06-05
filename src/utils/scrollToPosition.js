function scrollToPosition(element, to, duration) {
  const start = element.scrollTop,
    change = to - start,
    increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

function scrollToTop(element, to, duration) {
  // cancel if already on top
  // if (element.scrollTop === 0) return;

  const cosParameter = element.scrollTop / 2;
  let scrollCount = 0,
    oldTimestamp = null;

  function step(newTimestamp) {
    if (oldTimestamp !== null) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration;
      if (scrollCount >= Math.PI) return (element.scrollTop = 0);
      element.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount);
    }
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

export default scrollToTop;
