import { CostTypeWrapper } from 'components/costType';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Overview from './overview';

type OverviewWrapperProps = RouteComponentProps<void>;

const OverviewWrapper: React.FunctionComponent<OverviewWrapperProps> = props => {
  return (
    <CostTypeWrapper>
      <Overview {...props} />
    </CostTypeWrapper>
  );
};

export default OverviewWrapper;
