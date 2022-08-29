import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { onboardingActions } from 'store/onboarding';
import { arnValidator } from 'utils/validators';
import ArnForm from './form';
import EnableAccountAccessInstructions from './instructions';

interface Props extends InjectedTranslateProps {
  arn: string;
  updateArn: typeof onboardingActions.updateArn;
  arnValid: boolean;
}

const EnableAccountAccess: React.SFC<Props> = ({
  t,
  arn,
  updateArn,
  arnValid,
}) => {
  const onChange = (_name, event: React.FormEvent<HTMLInputElement>) => {
    updateArn(event.currentTarget.value, arnValidator);
  };
  return (
    <React.Fragment>
      <EnableAccountAccessInstructions t={t} />
      <br />
      <br />
      <ArnForm t={t} onChange={onChange} isValid={arnValid} value={arn} />
    </React.Fragment>
  );
};

export default EnableAccountAccess;
