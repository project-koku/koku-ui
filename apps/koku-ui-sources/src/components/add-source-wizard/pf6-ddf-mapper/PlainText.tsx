import { Content } from '@patternfly/react-core';
import React from 'react';

export const PlainText: React.FC<any> = ({ label, name }) => {
  return <Content key={name}>{label}</Content>;
};

PlainText.displayName = 'PlainText';
