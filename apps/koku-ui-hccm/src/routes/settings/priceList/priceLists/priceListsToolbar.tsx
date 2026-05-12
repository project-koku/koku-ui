import { Button, ButtonVariant, Switch } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface PriceListsToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isShowDeprecated?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onCreate?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onShowDeprecated(checked: boolean);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

type PriceListsToolbarProps = PriceListsToolbarOwnProps;

const PriceListsToolbar: React.FC<PriceListsToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  isShowDeprecated,
  itemsPerPage,
  itemsTotal,
  onCreate,
  onFilterAdded,
  onFilterRemoved,
  onShowDeprecated,
  pagination,
  query,
}) => {
  const intl = useIntl();

  const getActions = () => {
    const isAriaDisabled = !canWrite || isDisabled;

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
        <Button isAriaDisabled={isAriaDisabled} onClick={onCreate} variant={ButtonVariant.primary}>
          {intl.formatMessage(messages.createPriceList)}
        </Button>
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

export { PriceListsToolbar };
