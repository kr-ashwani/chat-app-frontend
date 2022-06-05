//collapseClass is class having height=0. so that this can be added to elem classList

function animateAutoHeight(elem, collapseClass, role) {
  // debugger;
  if (role === 'hide' && elem.classList.contains(collapseClass)) return 0;
  if (role === 'show' && !elem.classList.contains(collapseClass)) return 0;

  elem.style.height = '';
  elem.style.transition = 'none';

  const startHeight = window.getComputedStyle(elem).height;

  // Remove the collapse class, and force a layout calculation to get the final height
  elem.classList.toggle(collapseClass);
  const height = window.getComputedStyle(elem).height;

  // Set the start height to begin the transition
  elem.style.height = startHeight;

  // wait until the next frame so that everything has time to update before starting the transition
  requestAnimationFrame(() => {
    elem.style.transition = '';

    requestAnimationFrame(() => {
      elem.style.height = height;
    });
  });

  // Clear the saved height values after the transition

  function resetHeight() {
    elem.style.height = '';
    elem.removeEventListener('transitionend', resetHeight);
  }
  elem.addEventListener('transitionend', resetHeight);

  return height.split('px')[0] - startHeight.split('px')[0];
}

export default animateAutoHeight;
