import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { formatCurrency } from 'utils/rateCurrency';

export interface CostModelRateItemProps extends WrappedComponentProps {
  index: number;
  units: string;
  metric: string;
  measurement: string;
  rate: string;
  actionComponent?: React.ReactNode;
}

const CostModelRateItemBase: React.SFC<CostModelRateItemProps> = ({
  intl,
  index,
  units,
  metric,
  measurement,
  rate,
  actionComponent,
}) => {
  const unitsLabel = intl.formatMessage({ id: `cost_models.${units}` });
  return (
    <DataListItem aria-labelledby={`rate-${index}`}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`rate-data`}>
              <Title size={TitleSize.lg}>
                {intl.formatMessage({ id: `cost_models.${metric}` })} }
                {intl.formatMessage(
                  { id: `cost_models.lowercase.${measurement}` },
                  {
                    units: unitsLabel,
                  }
                )}
              </Title>
              <Title size={TitleSize.md}>
                {intl.formatMessage(
                  { id: `cost_models.for_every` },
                  {
                    units: unitsLabel,
                    rate: formatCurrency(Number(rate)),
                  }
                )}
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

export default injectIntl(CostModelRateItemBase);
