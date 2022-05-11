import React, { useEffect } from "react";

const AuthRedirect = () => {
  useEffect(() => {
    // get the URL parameters which will include the auth token
    const params = window.location.search;
    console.log(params);
    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage(params);
      // close the popup
      window.close();
      console.log(window.opener);
    }
  }, []);
  // some text to show the user
  return <p>Please wait...</p>;
};

export default AuthRedirect;
