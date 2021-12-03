import { CostTypeWrapper } from 'pages/views/components/costType';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AwsBreakdown from './awsBreakdown';

type AwsBreakdownWrapperProps = RouteComponentProps<void>;

const AwsBreakdownWrapper: React.FunctionComponent<AwsBreakdownWrapperProps> = props => {
  return (
    <CostTypeWrapper>
      <AwsBreakdown {...props} />
    </CostTypeWrapper>
  );
};

export default AwsBreakdownWrapper;
