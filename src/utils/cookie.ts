const tokenID = 'cs_jwt';

export function deleteSessionCookie(name) {
  // Delete only if cookie exists
  if (getCookie(name)) {
    const now = new Date();
    now.setTime(now.getTime() - 3600);
    document.cookie = `${name}=; expires=${now.toUTCString()}; path=/`;
  }
}

export function getCookie(name) {
  const cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookie ? cookie.pop() : '';
}

// Returns a relatively unique string to help determine a new user login
export function getTokenCookie() {
  const token = getCookie(tokenID);

  // Return the last 20 chars of the session token to avoid crashing APIs due to header length
  return token.substring(token.length - 20, token.length);
}

export function setSessionCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}
