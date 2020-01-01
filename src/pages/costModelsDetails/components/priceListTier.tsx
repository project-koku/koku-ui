import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DropdownItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { formatCurrency } from 'utils/rateCurrency';
import Dropdown from './dropdown';

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
  removeRate: () => void;
  updateRate?: () => void;
}

export const units = (metric: string) => {
  switch (metric) {
    case 'memory': {
      return 'GB-hour';
    }
    case 'storage': {
      return 'GB-month';
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
      <Title size={TitleSize.md}>
        {metricLabel}-{measurementLabel}
      </Title>
      <Title size={TitleSize.sm}>
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
  updateRate,
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
          <Dropdown
            isPlain
            dropdownItems={[
              updateRate && (
                <DropdownItem
                  key="edit"
                  onClick={updateRate}
                  component="button"
                >
                  {t('cost_models_wizard.price_list.update_button')}
                </DropdownItem>
              ),
              <DropdownItem
                key="delete"
                onClick={removeRate}
                component="button"
                style={{ color: 'red' }}
              >
                {t('cost_models_wizard.price_list.delete_button')}
              </DropdownItem>,
            ]}
          />
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};

export const PriceListTierDataItem = translate()(PriceListTierDataItemBase);
export const PriceListTier = translate()(PriceListTierBase);

export const metricName = (metric: string, measurement: string) => {
  switch (metric) {
    case 'storage': {
      return `storage_gb_${measurement}_per_month`;
    }
    case 'cpu': {
      return `cpu_core_${measurement}_per_hour`;
    }
    case 'node': {
      return 'node_cost_per_month';
    }
    default: {
      return `${metric}_gb_${measurement}_per_hour`;
    }
  }
};
