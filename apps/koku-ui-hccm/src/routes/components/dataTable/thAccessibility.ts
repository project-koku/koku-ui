import type { ReactNode } from 'react';

const hasVisibleHeaderName = (name?: ReactNode) => {
  if (name === undefined || name === null || name === false) {
    return false;
  }
  if (typeof name === 'string' || typeof name === 'number') {
    return String(name).trim().length > 0;
  }
  return true;
};

export const getThScreenReaderText = (name?: ReactNode, screenReaderText?: string) =>
  hasVisibleHeaderName(name) ? undefined : screenReaderText;
