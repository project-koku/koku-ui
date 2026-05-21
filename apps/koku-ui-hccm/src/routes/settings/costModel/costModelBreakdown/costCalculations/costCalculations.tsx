import { Grid, GridItem } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import { ProviderType } from 'api/providers';
import React from 'react';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';

import { Distribution } from './distribution';
import { Markup } from './markup';

interface CostCalculationsOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onSave?: (costModel: CostModel) => void;
}

type CostCalculationsProps = CostCalculationsOwnProps;

const CostCalculations: React.FC<CostCalculationsProps> = ({ canWrite, costModel, onSave }) => {
  const showDistribution = getSourceType(costModel.source_type) === ProviderType.ocp;

  return showDistribution ? (
    <Grid hasGutter>
      <GridItem lg={6} id="ref-markup">
        <Markup canWrite={canWrite} costModel={costModel} onSave={onSave} />
      </GridItem>
      <GridItem lg={6} id="ref-distribution">
        <Distribution canWrite={canWrite} costModel={costModel} onSave={onSave} />
      </GridItem>
    </Grid>
  ) : (
    <Markup canWrite={canWrite} costModel={costModel} onSave={onSave} />
  );
};

export { CostCalculations };
