import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { formatCurrency } from 'utils/rateCurrency';

export interface CostModelRateItemProps extends InjectedTranslateProps {
  index: number;
  units: string;
  metric: string;
  measurement: string;
  rate: string;
  actionComponent?: React.ReactNode;
}

const CostModelRateItemBase: React.SFC<CostModelRateItemProps> = ({
  t,
  index,
  units,
  metric,
  measurement,
  rate,
  actionComponent,
}) => {
  const unitsLabel = t(`cost_models.${units}`);
  return (
    <DataListItem aria-labelledby={`rate-${index}`}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`rate-data`}>
              <Title headingLevel="h2" size="lg">
                {t(`cost_models.${metric}`)}{' '}
                {t(`cost_models.lowercase.${measurement}`, {
                  units: unitsLabel,
                })}
              </Title>
              <Title headingLevel="h2" size="md">
                {t(`cost_models.for_every`, {
                  units: unitsLabel,
                  rate: formatCurrency(Number(rate)),
                })}
              </Title>
            </DataListCell>,
          ]}
        />
        {Boolean(actionComponent) && (
          <DataListAction
            aria-label={`actions rate-${index}`}
            id={`rate-actions-${index}`}
            aria-labelledby={`rate-${index}`}
          >
            {actionComponent}
          </DataListAction>
        )}
      </DataListItemRow>
    </DataListItem>
  );
};

export default translate()(CostModelRateItemBase);
