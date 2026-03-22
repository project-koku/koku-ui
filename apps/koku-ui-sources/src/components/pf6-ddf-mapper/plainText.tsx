import { Content } from '@patternfly/react-core';
import React from 'react';

const PlainText: React.FC<any> = ({ label, name }) => {
  return <Content key={name}>{label}</Content>;
};

export default PlainText;
