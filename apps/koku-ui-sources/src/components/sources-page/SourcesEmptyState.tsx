import { Card, CardBody, Content, ContentVariants, Stack, StackItem, Title } from '@patternfly/react-core';
import openshiftLogo from 'assets/openshift-logo.svg';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface SourcesEmptyStateProps {
  onAddSource: () => void;
  canWrite?: boolean;
}

export const SourcesEmptyState: React.FC<SourcesEmptyStateProps> = ({ onAddSource, canWrite = false }) => {
  const intl = useIntl();
  const addOpenShiftLabel = intl.formatMessage(messages.emptyStateAddOpenShift);

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
      <StackItem className="pf-v6-u-mt-lg" style={{ maxWidth: 320 }}>
        <Card
          isClickable
          isDisabled={!canWrite}
          onClick={() => {
            if (canWrite) {
              onAddSource();
            }
          }}
          aria-label={addOpenShiftLabel}
          ouiaId="sources-empty-add-openshift-card"
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'var(--pf-t--global--border--color--default)',
          }}
        >
          <CardBody className="pf-v6-u-text-align-center pf-v6-u-p-lg">
            <img
              src={openshiftLogo}
              alt={intl.formatMessage(messages.emptyStateLogoAlt)}
              style={{ height: 40, width: 'auto', display: 'inline-block' }}
            />
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};

SourcesEmptyState.displayName = 'SourcesEmptyState';
