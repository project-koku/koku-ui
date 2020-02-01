import {
  Button,
  ClipboardCopy,
  List,
  ListItem,
  Popover,
  Title,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

const ObtainLoginInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.obtain_login.instructions_title')}</Title>
      <div>
        {t('onboarding.obtain_login.intro')}
        <Popover
          aria-label={t('onboarding.obtain_login.popover_aria_label')}
          position="top"
          bodyContent={
            <Interpolate
              i18nKey="onboarding.obtain_login.popover_content"
              metering_operator={<i>reporting-operator</i>}
              learn_more={
                <a href="">{t('onboarding.obtain_login.learn_more')}</a>
              }
            />
          }
        >
          <Button variant="plain">
            <QuestionCircleIcon />
          </Button>
        </Popover>
      </div>
      <br />
      <List>
        <ListItem>{t('onboarding.obtain_login.obtain_token')}</ListItem>
        <ListItem>
          {t('onboarding.obtain_login.run_command')}
          <br />
          <ClipboardCopy
            textAriaLabel={t('onboarding.obtain_login.run_command_aria_label')}
          >
            oc serviceaccounts get-token reporting-operator > ocp_usage_token
          </ClipboardCopy>
        </ListItem>
        <ListItem>{t('onboarding.obtain_login.security')}</ListItem>
      </List>
    </React.Fragment>
  );
};

export default ObtainLoginInstructions;
