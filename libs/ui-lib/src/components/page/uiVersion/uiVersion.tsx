import React from 'react';

interface UiVersionProps {
  appName?: string;
}

const UiVersion = ({ appName = '@koku-ui' }: UiVersionProps) => {
  const branch = process.env.BRANCH ?? 'unknown-branch';
  const commithash = process.env.COMMITHASH ?? 'unknown-commithash';

  return <div id={`${appName}:${branch}:${commithash}`} hidden />;
};

export default UiVersion;
