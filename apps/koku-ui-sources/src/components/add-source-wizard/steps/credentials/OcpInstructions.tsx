import { Content, ContentVariants } from '@patternfly/react-core';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

export const OcpInstructions: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(messages.ocpInstructionsP1Before)} <strong>costmanagement-metrics-operator</strong>{' '}
        {intl.formatMessage(messages.ocpInstructionsP1After)}
      </Content>
      <Content component={ContentVariants.p} style={{ marginTop: '8px' }}>
        {intl.formatMessage(messages.ocpInstructionsP2Part1)}
        <code>create_source: true</code>
        {intl.formatMessage(messages.ocpInstructionsP2Part2)}
        <strong>{intl.formatMessage(messages.ocpInstructionsStopEmphasis)}</strong>
        {intl.formatMessage(messages.ocpInstructionsP2Part3)}
        <strong>{intl.formatMessage(messages.ocpInstructionsCancelEmphasis)}</strong>
        {intl.formatMessage(messages.ocpInstructionsP2Part4)}
      </Content>
      <Content component={ContentVariants.p} style={{ marginTop: '8px' }}>
        {intl.formatMessage(messages.ocpInstructionsP3)}
      </Content>
    </div>
  );
};

OcpInstructions.displayName = 'OcpInstructions';
