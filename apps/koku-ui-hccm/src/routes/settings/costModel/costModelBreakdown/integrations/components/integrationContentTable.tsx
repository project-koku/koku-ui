import 'routes/components/dataTable/dataTable.scss';

import type { CostModel } from 'api/costModels';
import type { Provider } from 'api/providers';
import { type Providers, ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';
import { getOperatorStatus } from 'routes/utils/operatorStatus';

import { styles } from './integrationContentTable.styles';

interface IntegrationContentTableOwnProps {
  costModel: CostModel;
  filterBy?: any;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onSelect?: (items: Provider[], isSelected: boolean) => void;
  providers: Providers;
  selectedItems: Provider[];
}

type IntegrationContentTableProps = IntegrationContentTableOwnProps;

const IntegrationContentTable: React.FC<IntegrationContentTableProps> = ({
  costModel,
  filterBy,
  isAllSelected,
  isLoading,
  onSelect,
  providers,
  selectedItems,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!providers) {
      return;
    }

    const newRows = [];
    const computedItems = providers?.data ?? [];
    const showOperatorVersion = getSourceType(costModel?.source_type) === ProviderType.ocp;

    const newColumns = [
      {
        name: '', // Selection column
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
      },
      {
        hidden: !showOperatorVersion,
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'operator_version' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cost_model' }),
      },
    ];

    computedItems.map(item => {
      const isAssigned = item.cost_models?.length > 0 && !item.cost_models?.some(val => val.uuid === costModel?.uuid);
      const assignedCostModel = item?.cost_models?.[0]?.name ?? '';

      newRows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            style: styles.column,
            value: item?.name ?? '',
          },
          {
            hidden: !showOperatorVersion,
            style: styles.column,
            value: getOperatorStatus(item?.additional_context?.operator_update_available),
          },
          {
            style: styles.column,
            value: assignedCostModel,
          },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.uuid === item.uuid) !== undefined),
        selectionDisabled: isAssigned,
        selectionTooltip: isAssigned
          ? intl.formatMessage(messages.costModelsWizardSourceWarning, {
              costModel: <b>{assignedCostModel}</b>,
            })
          : undefined,
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  useEffect(() => {
    initDatum();
  }, [costModel, providers, selectedItems]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      isSelectable
      onSelect={onSelect}
      rows={rows}
    />
  );
};

export { IntegrationContentTable };
