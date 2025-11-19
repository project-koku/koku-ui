import React from 'react';

interface UiVersionProps {
  appName?: string;
}

const UiVersion = ({ appName }: UiVersionProps) => {
  return <div id={`${appName}:${process.env.BRANCH}:${process.env.COMMITHASH}`} hidden />;
};

export default UiVersion;
