import { Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import { sourceTypeIconMap } from 'components/sourcesPage/sourceTypeIcons';
import React from 'react';
import type { SourceType } from 'typings/source';

interface SourceTypeTileProps {
  sourceType: SourceType;
  onClick: (sourceType: SourceType) => void;
}

const SourceTypeTile: React.FC<SourceTypeTileProps> = ({ sourceType, onClick }) => {
  const Icon = sourceTypeIconMap[sourceType.id];

  return (
    <Card isClickable>
      <CardHeader
        selectableActions={{
          onClickAction: () => onClick(sourceType),
          selectableActionId: `source-type-${sourceType.id}`,
          selectableActionAriaLabel: sourceType.product_name,
        }}
      />
      <CardBody style={{ textAlign: 'center' }}>
        {Icon && <Icon style={{ width: 40, height: 40, marginBottom: 'var(--pf-t--global--spacer--md)' }} />}
        <Title headingLevel="h3" size="md">
          {sourceType.product_name}
        </Title>
      </CardBody>
    </Card>
  );
};

export { SourceTypeTile };
