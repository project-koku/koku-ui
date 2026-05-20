import { Grid, GridItem } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import React from 'react';

import { Distribution } from './distribution';
import { Markup } from './markup';

interface CostCalculationsOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onSave?: (costModel: CostModel) => void;
}

type CostCalculationsProps = CostCalculationsOwnProps;

const CostCalculations: React.FC<CostCalculationsProps> = ({ canWrite, costModel, onSave }) => {
  return (
    <Grid hasGutter>
      <GridItem lg={6} id="ref-markup">
        <Markup canWrite={canWrite} costModel={costModel} onSave={onSave} />
      </GridItem>
      <GridItem lg={6} id="ref-distribution">
        <Distribution canWrite={canWrite} costModel={costModel} onSave={onSave} />
      </GridItem>
    </Grid>
  );
};

export { CostCalculations };
