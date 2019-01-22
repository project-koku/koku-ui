import { Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import CopyClipboard from '../../../components/copyClipboard';

const ConfigureInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.configure.instructions_title')}</Title>
      <div>{t('onboarding.configure.instructions_text')}</div>
      <br />
      <Title size="md">{t('onboarding.configure.edit_contrab_title')}</Title>
      <div>{t('onboarding.configure.edit_contrab')}</div>
      <CopyClipboard
        text="# contrab -u <username> -e"
        aria-label="command line to edit contrab"
      />
      <br />
      <Title size="md">{t('onboarding.configure.create_entry_title')}</Title>
      <div>{t('onboarding.configure.create_entry')}</div>
      <CopyClipboard
        text="*/45 * * * * /path/to/ocp_usage.sh --collect"
        aria-label="entry to run OCP Usage collector every 45 minutes"
      />
      <br />
      <Title size="md">{t('onboarding.configure.note_title')}</Title>
      <div>{t('onboarding.configure.note')}</div>
      <CopyClipboard
        text="ocpcollector ALL=(ALL) NOPASSWD: ALL"
        aria-label="set sudo authority to interact with Red Hat Insights Client"
      />
      <br />
    </React.Fragment>
  );
};

export default ConfigureInstructions;
