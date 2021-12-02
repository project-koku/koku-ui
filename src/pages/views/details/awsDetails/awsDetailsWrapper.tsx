import { CostTypeWrapper } from 'components/costType/costTypeWrapper';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AwsDetails from './awsDetails';

type AwsDetailsWrapperProps = RouteComponentProps<void>;

const AwsDetailsWrapper: React.FunctionComponent<AwsDetailsWrapperProps> = props => {
  return (
    <CostTypeWrapper>
      <AwsDetails {...props} />
    </CostTypeWrapper>
  );
};

export default AwsDetailsWrapper;
