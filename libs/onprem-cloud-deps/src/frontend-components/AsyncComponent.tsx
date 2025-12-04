import { ScalprumComponent } from '@scalprum/react-core';
import React from 'react';

const AsyncComponent = (props: { module: string; scope: string }) => {
  return <ScalprumComponent {...props} />;
};

export default AsyncComponent;
