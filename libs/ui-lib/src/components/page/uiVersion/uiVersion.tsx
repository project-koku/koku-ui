import React from 'react';

const UiVersion = () => {
  const pkgname = process.env.KOKU_UI_PKGNAME ?? 'unknown-pkgname';
  const commithash = process.env.KOKU_UI_COMMITHASH ?? 'unknown-commithash';

  return <div id={`${pkgname}_${commithash}`} hidden />;
};

export default UiVersion;
