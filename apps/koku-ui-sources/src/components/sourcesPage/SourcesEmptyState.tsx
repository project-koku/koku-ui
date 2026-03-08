import { EmptyState, EmptyStateBody, Grid, GridItem } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { SOURCE_TYPES } from 'api/sourceTypes';
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
    <>
      <EmptyState icon={PlusCircleIcon} titleText={intl.formatMessage(messages.emptyStateTitle)}>
        <EmptyStateBody>{intl.formatMessage(messages.emptyStateBody)}</EmptyStateBody>
      </EmptyState>
      <Grid hasGutter span={6} className="pf-v6-u-m-auto" style={{ width: '48rem' }}>
        {SOURCE_TYPES.map(sourceType => (
          <GridItem key={sourceType.id}>
            <SourceTypeTile sourceType={sourceType} onClick={onSelectType} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export { SourcesEmptyState };
