import 'routes/components/dataTable/dataTable.scss';

import type { CostModel, CostModelProvider } from 'api/costModels';
import { type Provider, ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import { DeleteIntegrationAction } from 'routes/settings/costModels/costModelBreakdown/integrations/components/actions';

import { styles } from './integrationTable.styles';
import { getOperatorStatus } from './utils/operatorStatus';

interface IntegrationTableOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onDelete?: (uuids: string[]) => void;
  orderBy?: any;
  providers: Provider[];
  sources: CostModelProvider[];
}

type IntegrationTableProps = IntegrationTableOwnProps;

const IntegrationTable: React.FC<IntegrationTableProps> = ({
  canWrite,
  costModel,
  filterBy,
  isDisabled,
  isLoading,
  onClose,
  onDelete,
  orderBy,
  providers,
  sources,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!sources) {
      return;
    }

    const newRows = [];
    const computedItems = sources ?? [];
    const showOperatorVersion = getSourceType(costModel.source_type) === ProviderType.ocp;

    const newColumns = [
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
      },
      {
        hidden: !showOperatorVersion,
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'operator_version' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'last_processed' }),
      },
      {
        isActionsCell: true,
        name: '', // Actions column
      },
    ];

    computedItems.forEach(item => {
      newRows.push({
        cells: [
          {
            style: styles.column,
            value: item?.name ?? '',
          },
          {
            hidden: !showOperatorVersion,
            style: styles.column,
            value: getOperatorStatus(
              providers?.find(p => p.uuid === item.uuid)?.additional_context?.operator_update_available
            ),
          },
          {
            style: styles.column,
            value: item?.last_processed
              ? intl.formatDate(item?.last_processed, {
                  day: 'numeric',
                  hour: 'numeric',
                  hour12: false,
                  minute: 'numeric',
                  month: 'short',
                  timeZone: 'UTC',
                  timeZoneName: 'short',
                  year: 'numeric',
                })
              : '',
          },
          {
            value: (
              <DeleteIntegrationAction
                costModel={costModel}
                canWrite={canWrite}
                isDisabled={isDisabled}
                onClose={onClose}
                onDelete={onDelete}
                sources={sources}
                uuid={item?.uuid}
              />
            ),
          },
        ],
        id: item?.uuid,
        item,
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
  }, [costModel, providers, sources]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { IntegrationTable };
