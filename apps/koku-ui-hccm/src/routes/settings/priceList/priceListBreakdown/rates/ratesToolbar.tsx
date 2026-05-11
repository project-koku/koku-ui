import type { MetricHash } from 'api/metrics';
import type { PriceListData } from 'api/priceList';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Rate } from 'api/rates';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { AddRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/add';
import type { Filter } from 'routes/utils/filter';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { metricsActions, metricsSelectors } from 'store/metrics';

interface RatesToolbarOwnProps {
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
  onSuccess?: () => void;
  pagination?: React.ReactNode;
  priceList: PriceListData; // Price list without filters and pagination for editing
  query?: OcpQuery;
  selectedItems?: SettingsData[];
}

interface RatesToolbarStateProps {
  metricsHash: MetricHash;
  metricsHashStatus: FetchStatus;
}

type RatesToolbarProps = RatesToolbarOwnProps;

const RatesToolbar: React.FC<RatesToolbarProps> = ({
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
  onSuccess,
  pagination,
  priceList,
  query,
  selectedItems,
}) => {
  const intl = useIntl();

  const { metricsHash } = useMapToProps();

  const getActions = () => {
    return (
      <AddRate
        canWrite={canWrite}
        isDisabled={isDisabled}
        isDispatch={isDispatch}
        onAdd={onAdd}
        onClose={onClose}
        onSuccess={onSuccess}
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

    if (metricsHash) {
      options.push({
        key: 'metrics',
        name: intl.formatMessage(messages.filterByValues, { value: 'metric' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: Object.keys(metricsHash)
          .map(metric => ({ key: metric, name: metric }))
          .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? '')),
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
    />
  );
};

const useMapToProps = (): RatesToolbarStateProps => {
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

export { RatesToolbar };
