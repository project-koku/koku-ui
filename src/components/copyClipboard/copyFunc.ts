import React from 'react';

const copy = (event: React.FormEvent<HTMLButtonElement>, text): void => {
  const clipboard = event.currentTarget.parentElement;
  const el = document.createElement('input');
  el.value = text;
  clipboard.appendChild(el);
  el.select();
  document.execCommand('copy');
  clipboard.removeChild(el);
};

export default copy;
