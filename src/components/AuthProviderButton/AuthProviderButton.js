import React from "react";
import "./AuthProviderButton.css";

const AuthProviderButton = ({ url, icon, setServerRes }) => {
  let windowObjectReference = null;
  let previousUrl = null;

  const openSignInWindow = (url, name) => {
    // window features
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=600, height=700, top=100, left=0";
    if (windowObjectReference === null || windowObjectReference.closed) {
      /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
      windowObjectReference = window.open(url, name, strWindowFeatures);
    } else if (previousUrl !== url) {
      /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
      windowObjectReference = window.open(url, name, strWindowFeatures);
      windowObjectReference.focus();
    } else {
      /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
      windowObjectReference.focus();
    }
    // add the listener for receiving a message from the popup
    window.addEventListener("message", receiveMessage);
    // assign the previous URL
    previousUrl = url;
  };

  function receiveMessage(event) {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    window.removeEventListener("message", receiveMessage);
    if (event.origin !== `${process.env.REACT_APP_SELF_DOMAIN}`) return;
    if (!(typeof event.data === "string")) return;
    const serverObj = {};
    for (let [key, value] of new URLSearchParams(event.data))
      serverObj[key] = value;
    setServerRes(serverObj);
  }

  return <div onClick={() => openSignInWindow(url)}>{icon}</div>;
};

export default AuthProviderButton;
