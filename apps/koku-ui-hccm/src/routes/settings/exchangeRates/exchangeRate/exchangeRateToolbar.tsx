import { Switch } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData, SettingsRateData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

import { AddRate } from './components/add';

interface ExchangeRateToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isShowDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (rate: SettingsRateData) => void;
  onClose?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onShowDeprecated(checked: boolean);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  settings?: SettingsData[];
}

type ExchangeRateToolbarProps = ExchangeRateToolbarOwnProps;

const ExchangeRateToolbar: React.FC<ExchangeRateToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  isShowDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onClose,
  onFilterAdded,
  onFilterRemoved,
  onShowDeprecated,
  pagination,
  query,
  settings,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return (
      <>
        <span>
          <Switch
            id="disabled-rates-toggle"
            label={intl.formatMessage(messages.showDisabled)}
            isChecked={isShowDisabled}
            onChange={handleOnChange}
          />
        </span>
        <AddRate canWrite={canWrite} isDisabled={isDisabled} onAdd={onAdd} onClose={onClose} settings={settings} />
      </>
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'currency',
        placeholderKey: 'currency',
        key: 'currency',
        name: intl.formatMessage(messages.filterByValues, { value: 'currency' }),
      },
    ];
    return options;
  };

  const handleOnChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    if (onShowDeprecated) {
      onShowDeprecated(checked);
    }
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
      showFilter
    />
  );
};

export { ExchangeRateToolbar };
