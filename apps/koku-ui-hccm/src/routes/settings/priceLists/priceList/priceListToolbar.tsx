import { Switch } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { CreatePriceListAction } from 'routes/settings/priceLists/priceListCreate/components/actions';
import type { Filter } from 'routes/utils/filter';

export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface PriceListToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isShowDeprecated?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onShowDeprecated(checked: boolean);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

type PriceListToolbarProps = PriceListToolbarOwnProps;

const PriceListToolbar: React.FC<PriceListToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  isShowDeprecated,
  itemsPerPage,
  itemsTotal,
  onFilterAdded,
  onFilterRemoved,
  onShowDeprecated,
  pagination,
  query,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return (
      <>
        <span>
          <Switch
            id="simple-switch"
            label={intl.formatMessage(messages.showDeprecated)}
            isChecked={isShowDeprecated}
            onChange={handleOnChange}
            ouiaId="BasicSwitch"
          />
        </span>
        <CreatePriceListAction canWrite={canWrite} isDisabled={isDisabled} />
      </>
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'name',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
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

export { PriceListToolbar };
