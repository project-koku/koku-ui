import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';
import React from 'react';

interface AsyncComponentProps {
  module: string;
  scope: string;
  [key: string]: unknown;
}

const AsyncComponent: React.FC<AsyncComponentProps> = props => {
  return (
    <ScalprumComponent
      fallback={
        <Bullseye>
          <Spinner size="lg" />
        </Bullseye>
      }
      {...props}
    />
  );
};

export default AsyncComponent;
