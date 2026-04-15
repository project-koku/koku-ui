const locale = navigator.language.split(/[-_]/)[0] || 'en';

export const getLocale = () => {
  return locale;
};

export const ignoreDefaultMessageError = (error: { code?: string }) => {
  if (error?.code === 'MISSING_TRANSLATION') {
    return;
  }
  throw error;
};
