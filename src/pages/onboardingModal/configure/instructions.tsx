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

interface ConfigureInstructionsProps extends InjectedTranslateProps {
  clusterId: string;
}

const ConfigureInstructions: React.SFC<ConfigureInstructionsProps> = ({
  t,
  clusterId,
}) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.configure.instructions_title')}</Title>
      <div>{t('onboarding.configure.instructions_text')}</div>
      <br />
      <List>
        <ListItem>
          {t('onboarding.configure.edit_crontab')}
          <Popover
            position="right"
            aria-label={t('onboarding.configure.explain_more_about_cron')}
            bodyContent={
              <div>
                {t('onboarding.configure.cron_user_reqs')}
                <List>
                  <ListItem>
                    <Interpolate
                      i18nKey="onboarding.configure.cron_user_req_1"
                      metering_operator={<i>metering-operator</i>}
                    />
                  </ListItem>
                  <ListItem>
                    {t('onboarding.configure.cron_user_req_2')}
                  </ListItem>
                </List>
                <Interpolate
                  i18nKey="onboarding.configure.cron_user_more"
                  sub_text={<i>ocpcollector</i>}
                  path={<b>/etc/sudoers</b>}
                />
                <br />
                <b>ocpcollector ALL=(ALL) NOPASSWD: ALL</b>
              </div>
            }
          >
            <Button variant="plain">
              <QuestionCircleIcon />
            </Button>
          </Popover>
          <ClipboardCopy
            textAriaLabel={t('onboarding.configure.crontab_command')}
          >{`crontab -u <username> -e`}</ClipboardCopy>
        </ListItem>
        <ListItem>
          {t('onboarding.configure.create_entry')}
          <ClipboardCopy
            textAriaLabel={t('onboarding.configure.entry_description')}
          >
            {`*/45 * * * * /path/to/ocp_usage.sh --collect --e OCP_CLUSTER_ID="${clusterId}"`}
          </ClipboardCopy>
        </ListItem>
        <ListItem> {t('onboarding.configure.click_next')} </ListItem>
      </List>
    </React.Fragment>
  );
};

export default ConfigureInstructions;
