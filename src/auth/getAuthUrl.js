const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;
function getGoogleAuthUrl(type) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ENDPOINT}/auth/google/${type}`,
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}

function getGithubAuthUrl(type) {
  const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${SERVER_ENDPOINT}/auth/github/${type}&scope=user:email`;
}
function getFacebookAuthUrl(type) {
  const APP_ID = process.env.REACT_APP_FB_APP_ID;
  const STATE_PARAMS = process.env.REACT_APP_FB_STATE_PARAMS;

  return `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${SERVER_ENDPOINT}/auth/facebook/${type}&state=${STATE_PARAMS}&scope=email,public_profile`;
}

export { getFacebookAuthUrl, getGithubAuthUrl, getGoogleAuthUrl };
