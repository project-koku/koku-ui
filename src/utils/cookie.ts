export function deleteSessionCookie(name) {
  const now = new Date();
  now.setTime(now.getTime() - 3600);
  document.cookie = `${name}=; expires=${now.toUTCString()}; path=/`;
}

export function getCookieValue(name) {
  const cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookie ? cookie.pop() : '';
}

export function setSessionCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}
