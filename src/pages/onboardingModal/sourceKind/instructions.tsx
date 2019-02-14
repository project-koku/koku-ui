import { Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

const SourceKindInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.source_kind.instructions_title')}</Title>
      <div>{t('onboarding.source_kind.instructions_text')}</div>
      <br />
    </React.Fragment>
  );
};

export default SourceKindInstructions;
