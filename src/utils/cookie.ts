export const deleteSessionCookie = name => {
  // Delete only if cookie exists
  if (getCookie(name)) {
    const now = new Date();
    now.setTime(now.getTime() - 3600);
    document.cookie = `${name}=; expires=${now.toUTCString()}; path=/`;
  }
};

export const getCookie = name => {
  const cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookie ? cookie.pop() : '';
};

// Returns session token
export const getTokenCookie = () => {
  return getCookie('cs_jwt');
};

export const setSessionCookie = (name, value) => {
  document.cookie = `${name}=${value}; path=/`;
};
