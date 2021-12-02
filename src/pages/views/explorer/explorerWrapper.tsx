import { CostTypeWrapper } from 'components/costType';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Explorer from './explorer';

type ExplorerWrapperProps = RouteComponentProps<void>;

const ExplorerWrapper: React.FunctionComponent<ExplorerWrapperProps> = props => {
  return (
    <CostTypeWrapper>
      <Explorer {...props} />
    </CostTypeWrapper>
  );
};

export default ExplorerWrapper;
