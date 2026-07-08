import type { Metric, MetricHash } from 'api/metrics';
import type { PriceListData } from 'api/priceList';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Rate } from 'api/rates';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import uniqBy from 'lodash/uniqBy';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { AddRate } from 'routes/settings/priceLists/priceListBreakdown/rates/components/add';
import type { Filter } from 'routes/utils/filter';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { metricsActions, metricsSelectors } from 'store/metrics';

import { getCostTypeLabel, getMeasurementLabel, getMetricLabel } from './utils';

interface RateToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (rates: Rate[]) => void;
  onClose?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  priceList: PriceListData; // Price list without filters and pagination for editing
  query?: OcpQuery;
  selectedItems?: SettingsData[];
}

interface RateToolbarStateProps {
  metricsHash: MetricHash;
  metricsHashStatus: FetchStatus;
}

type RateToolbarProps = RateToolbarOwnProps;

const RateToolbar: React.FC<RateToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  isDispatch,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onClose,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  priceList,
  query,
  selectedItems,
}) => {
  const intl = useIntl();

  const { metricsHash } = useMapToProps();

  // Metrics

  const metricOpts = Object.keys(metricsHash || {})
    .map(m => ({
      key: m,
      name: getMetricLabel(m),
    }))
    .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''));

  const measurementOpts = uniqBy(
    metricOpts.flatMap(curr => {
      const metricGroup = (metricsHash?.[curr.key] || {}) as Record<string, Metric>;
      return Object.keys(metricGroup).map(m => {
        const labelMeasurement = metricGroup[m]?.label_measurement;
        return {
          key: labelMeasurement,
          name: getMeasurementLabel(labelMeasurement),
        };
      });
    }),
    'key'
  )
    .filter(({ key }) => key) // Omit empty keys
    .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''));

  const costTypeOpts = uniqBy(
    metricOpts.flatMap(curr => {
      const metricGroup = (metricsHash?.[curr.key] || {}) as Record<string, Metric>;
      return Object.keys(metricGroup).map(m => {
        const defaultCostType = metricGroup[m]?.default_cost_type;
        return {
          key: defaultCostType,
          name: getCostTypeLabel(defaultCostType),
        };
      });
    }),
    'key'
  )
    .filter(({ key }) => key) // Omit empty keys
    .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''));

  // Getters

  const getActions = () => {
    return (
      <AddRate
        canWrite={canWrite}
        isDisabled={isDisabled}
        isDispatch={isDispatch}
        onAdd={onAdd}
        onClose={onClose}
        priceList={priceList}
      />
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options: ToolbarChipGroupExt[] = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'name',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
    ];

    if (costTypeOpts?.length) {
      options.push({
        key: 'cost_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'cost_type' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: costTypeOpts,
      });
    }
    if (measurementOpts?.length) {
      options.push({
        key: 'measurement',
        name: intl.formatMessage(messages.filterByValues, { value: 'measurement' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: measurementOpts,
      });
    }
    if (metricOpts?.length) {
      options.push({
        key: 'metric_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'metric' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: metricOpts,
      });
    }
    return options;
  };

  return (
    <BasicToolbar
      actions={getActions()}
      categoryOptions={getCategoryOptions()}
      isAllSelected={isAllSelected}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      pagination={pagination}
      query={query}
      resourcePathsType={ResourcePathsType.ocp}
      selectedItems={selectedItems}
      showFilter
      useActiveFilters
    />
  );
};

const useMapToProps = (): RateToolbarStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // Fetch metrics
  const metricsHash = useSelector((state: RootState) => metricsSelectors.metrics(state));
  const metricsHashStatus = useSelector((state: RootState) => metricsSelectors.status(state));

  useEffect(() => {
    if (metricsHashStatus !== FetchStatus.inProgress && metricsHashStatus !== FetchStatus.complete) {
      dispatch(metricsActions.fetchMetrics());
    }
  }, [metricsHashStatus]);

  return {
    metricsHash,
    metricsHashStatus,
  };
};

export { RateToolbar };
