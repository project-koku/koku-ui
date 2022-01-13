import { AccountSettings } from 'pages/views/components/accountSettings';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Explorer from './explorer';

type ExplorerWrapperProps = RouteComponentProps<void>;

const ExplorerWrapper: React.FunctionComponent<ExplorerWrapperProps> = props => {
  return (
    <AccountSettings>
      <Explorer {...props} />
    </AccountSettings>
  );
};

export default ExplorerWrapper;
