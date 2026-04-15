import { Button, Content, ContentVariants, Stack, StackItem, Title } from '@patternfly/react-core';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface SourcesEmptyStateProps {
  onAddSource: () => void;
  canWrite?: boolean;
}

export const SourcesEmptyState: React.FC<SourcesEmptyStateProps> = ({ onAddSource, canWrite = false }) => {
  const intl = useIntl();

  return (
    <Stack hasGutter className="pf-v6-u-w-100">
      <StackItem className="pf-v6-u-text-align-left">
        <Title headingLevel="h2" size="2xl">
          {intl.formatMessage(messages.emptyStateTitle)}
        </Title>
        <Content component={ContentVariants.p} className="pf-v6-u-mt-md">
          {intl.formatMessage(messages.emptyStateBody)}
        </Content>
      </StackItem>
      <StackItem className="pf-v6-u-mt-lg">
        <Button variant="primary" onClick={onAddSource} isDisabled={!canWrite}>
          {intl.formatMessage(messages.emptyStateAddOpenShift)}
        </Button>
      </StackItem>
    </Stack>
  );
};

SourcesEmptyState.displayName = 'SourcesEmptyState';
