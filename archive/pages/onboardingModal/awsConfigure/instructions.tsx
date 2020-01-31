import { List, ListItem, Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

const AwsConfigureInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <React.Fragment>
      <Title size="xl">
        {t('onboarding.aws_configure.instructions_title')}
      </Title>
      <div>{t('onboarding.aws_configure.intro')}</div>
      <br />
      <List>
        <ListItem>{t('onboarding.aws_configure.s3_bucket_account')}</ListItem>
        <ListItem>
          {t('onboarding.aws_configure.cost_report')}
          <List>
            <ListItem>{t('onboarding.aws_configure.report_name')}</ListItem>
            <ListItem>{t('onboarding.aws_configure.time_unit')}</ListItem>
            <ListItem>{t('onboarding.aws_configure.include')}</ListItem>
            <ListItem>{t('onboarding.aws_configure.support')}</ListItem>
            <ListItem>{t('onboarding.aws_configure.prefix')}</ListItem>
          </List>
        </ListItem>
        <ListItem>{t('onboarding.aws_configure.enter_s3_bucket')}</ListItem>
      </List>
    </React.Fragment>
  );
};

export default AwsConfigureInstructions;
