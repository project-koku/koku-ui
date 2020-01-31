import {
  Button,
  List,
  ListItem,
  Popover,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

const UsageCollectorInstructions: React.SFC<InjectedTranslateProps> = ({
  t,
}) => {
  return (
    <React.Fragment>
      <Title size={TitleSize.xl}>
        {t('onboarding.usage_collector.instructions_title')}
      </Title>
      <div>{t('onboarding.usage_collector.instructions_text')}</div>
      <br />
      <List>
        <ListItem>
          <Interpolate
            i18nKey="onboarding.usage_collector.download_and_install"
            usage_collector={
              <a
                href="https://github.com/project-koku/korekuta/archive/master.zip"
                target="_blank"
              >
                {t('onboarding.usage_collector.ocp_usage_collector')}
              </a>
            }
          />
        </ListItem>
        <ListItem>
          <Interpolate
            i18nKey="onboarding.usage_collector.navigate"
            korekuta_master={<b>korekuta-master</b>}
            ocp_usage_sh={<i>ocp_usage.sh</i>}
          />
        </ListItem>
        <ListItem>
          <Interpolate
            i18nKey="onboarding.usage_collector.run"
            ocp_usage_sh={<i>ocp_usage.sh</i>}
          />
          <br />
          <Interpolate
            i18nKey="onboarding.usage_collector.example_text"
            reporting-operator={<i>reporting-operator</i>}
          />
          <br />
          <br /># ./ocp_usage.sh --setup -e
          OCP_API="https://api.openshift-prod.mycompany.com" -e
          OCP_METERING_NAMESPACE="metering" -e
          OCP_TOKEN_PATH="/path/to/ocp_usage_token" -e
          METERING_API="https://metering.metering.api.ocp.com”
          <Popover
            aria-label={t('onboarding.usage_collector.popover_cmd_aria_label')}
            position="right"
            bodyContent={t('onboarding.usage_collector.popover_cmd_content')}
          >
            <Button variant="plain">
              <QuestionCircleIcon />
            </Button>
          </Popover>
        </ListItem>
        <ListItem>
          {t('onboarding.usage_collector.configuration_complete')}
        </ListItem>
      </List>
    </React.Fragment>
  );
};

export default UsageCollectorInstructions;
