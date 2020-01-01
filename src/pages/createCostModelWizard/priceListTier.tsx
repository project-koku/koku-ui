import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { formatCurrency } from 'utils/rateCurrency';

export interface TierType {
  metric: string;
  measurement: string;
  rate: number;
}

interface TierItemProps extends InjectedTranslateProps {
  rate: number;
  metricLabel: string;
  measurementLabel: string;
  unitsLabel: string;
}

interface DataListItemProps extends InjectedTranslateProps {
  tier: TierType;
  index: number;
  removeRate: (index: number) => void;
}

export const units = (metric: string) => {
  switch (metric) {
    case 'memory': {
      return 'GB-hour';
    }
    case 'storage': {
      return 'GB-month';
    }
    case 'node': {
      return 'node-month';
    }
    default: {
      return 'core-hour';
    }
  }
};

export const getLabels = (t, tier: TierType) => {
  const { metric, measurement } = tier;
  const metric_label = t(`cost_models_wizard.price_list.${metric}_metric`);
  const units_label = t(`cost_models_wizard.price_list.${metric}_units`);
  const measurement_label = t(`cost_models_wizard.price_list.${measurement}`, {
    units: units_label,
  });

  return [metric_label, units_label, measurement_label];
};

const PriceListTierBase: React.SFC<TierItemProps> = ({
  rate,
  metricLabel,
  unitsLabel,
  measurementLabel,
  t,
}) => {
  return (
    <>
      <Title size={TitleSize.lg}>
        {metricLabel}-{measurementLabel}
      </Title>
      <Title size={TitleSize.md}>
        {t('cost_models_wizard.price_list.for_every', {
          units: unitsLabel,
          rate: formatCurrency(rate),
        })}
      </Title>
    </>
  );
};

const PriceListTierDataItemBase: React.SFC<DataListItemProps> = ({
  tier,
  index,
  t,
  removeRate,
}) => {
  const [metric_label, units_label, measurement_label] = getLabels(t, tier);
  return (
    <DataListItem
      aria-labelledby={`tier-data-list-${index}`}
      key={`item-${index}`}
    >
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`data-list-cell-${index}`}>
              <PriceListTierBase
                t={t}
                rate={tier.rate}
                metricLabel={metric_label}
                unitsLabel={units_label}
                measurementLabel={measurement_label}
              />
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-label={`${t(
            'cost_models_wizard.price_list.actions'
          )} tier-data-list-${index}`}
          id={`actions-item-${index}`}
          aria-labelledby={`tier-data-list-${index} ${t(
            'cost_models_wizard.price_list.actions_delete'
          )}`}
        >
          <Button variant="link" onClick={() => removeRate(index)}>
            {t('cost_models_wizard.price_list.remove_button')}
          </Button>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};

export const PriceListTierDataItem = translate()(PriceListTierDataItemBase);
export const PriceListTier = translate()(PriceListTierBase);
