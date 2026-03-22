import { Content, ContentVariants, Grid, GridItem, Stack, StackItem, Title } from '@patternfly/react-core';
import { SOURCE_TYPES_INTEGRATIONS_UI } from 'api/sourceTypes';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { SourceType } from 'typings/source';

import { SourceTypeTile } from './SourceTypeTile';

interface SourcesEmptyStateProps {
  onSelectType: (sourceType: SourceType) => void;
}

const SourcesEmptyState: React.FC<SourcesEmptyStateProps> = ({ onSelectType }) => {
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
      <StackItem>
        <div className="pf-v6-u-display-flex pf-v6-u-justify-content-center pf-v6-u-mt-xl">
          <Grid hasGutter span={6} style={{ width: '48rem', maxWidth: '100%' }}>
            {SOURCE_TYPES_INTEGRATIONS_UI.map(sourceType => (
              <GridItem key={sourceType.id}>
                <SourceTypeTile sourceType={sourceType} onClick={onSelectType} />
              </GridItem>
            ))}
          </Grid>
        </div>
      </StackItem>
    </Stack>
  );
};

export { SourcesEmptyState };
