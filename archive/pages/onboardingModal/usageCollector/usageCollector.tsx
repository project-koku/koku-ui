import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { onboardingActions } from 'store/onboarding';
import { ocpClusterIdValidator } from 'utils/validators';
import ClusterIdForm from './form';
import Instructions from './instructions';

interface Props extends InjectedTranslateProps {
  clusterId: string;
  updateClusterId: typeof onboardingActions.updateClusterID;
  clusterIdValid: boolean;
}

const UsageCollector: React.SFC<Props> = ({
  t,
  clusterId,
  updateClusterId,
  clusterIdValid,
}) => {
  const onChange = (_name, event: React.FormEvent<HTMLInputElement>) => {
    updateClusterId(event.currentTarget.value, ocpClusterIdValidator);
  };
  return (
    <React.Fragment>
      <Instructions t={t} />
      <br />
      <br />
      <ClusterIdForm
        t={t}
        onChange={onChange}
        isValid={clusterIdValid}
        value={clusterId}
      />
    </React.Fragment>
  );
};

export default UsageCollector;
