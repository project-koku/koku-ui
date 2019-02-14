import { List, ListItem, Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

const UsageCollectorInstructions: React.SFC<InjectedTranslateProps> = ({
  t,
}) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.korekuta.instructions_title')}</Title>
      <div>{t('onboarding.korekuta.instructions_text')}</div>
      <br />
      {t('onboarding.korekuta.checklist_title')}
      <List>
        <ListItem>
          <React.Fragment>
            <Interpolate
              i18nKey="onboarding.korekuta.download_and_install"
              korekuta={
                <a
                  href="https://koku.readthedocs.io/en/latest/providers.html#download-and-configure-ocp-usage-collector-korekuta"
                  target="_blank"
                >
                  OCP Usage Collector
                </a>
              }
            />
            <br />
            {t('onboarding.korekuta.checklist_title')}
            <br />
            <List>
              <ListItem>{t('onboarding.korekuta.checkbox_1')}</ListItem>
              <ListItem>{t('onboarding.korekuta.checkbox_2')}</ListItem>
              <ListItem>{t('onboarding.korekuta.checkbox_3')}</ListItem>
              <ListItem>{t('onboarding.korekuta.checkbox_4')}</ListItem>
            </List>
            <div>{t('onboarding.korekuta.for_example')}</div>
            <br />
            <div>
              # ./ocp_usage.sh --setup -e
              OCP_API="https://api.openshift-prod.mycompany.com" -e
              OCP_METERING_NAMESPACE="metering" -e
              OCP_TOKEN_PATH="/path/to/ocp_usage_token"
            </div>
          </React.Fragment>
        </ListItem>
        <ListItem>{t('onboarding.korekuta.post_installation')}</ListItem>
      </List>
    </React.Fragment>
  );
};

export default UsageCollectorInstructions;
