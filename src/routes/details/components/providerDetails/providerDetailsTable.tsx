import type { Providers, ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { filterProviders } from 'routes/utils/providers';

import { OverallStatus } from './components/overallStatus';
import { SourceLink } from './components/sourceLink';
import { ProviderDetailsModal } from './providerDetailsModal';

interface ProviderDetailsTableOwnProps {
  providers?: Providers;
  providerType?: ProviderType;
}

type ProviderDetailsTableProps = ProviderDetailsTableOwnProps;

const ProviderDetailsTable: React.FC<ProviderDetailsTableProps> = ({ providers, providerType }) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!providers) {
      return;
    }

    // Filter OCP providers to skip an extra API request
    const filteredProviders = filterProviders(providers, providerType);

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.integration),
      },
      {
        name: intl.formatMessage(messages.lastUpdated),
      },
      {
        name: intl.formatMessage(messages.status),
      },
      {
        name: '',
      },
    ];

    filteredProviders?.data?.map(item => {
      // const clusterId = item?.authentication?.credentials?.cluster_id;

      newRows.push({
        cells: [
          { value: <SourceLink provider={item} showLabel={false} /> },
          { value: <OverallStatus providerId={item.id} providerType={providerType} isLastUpdated /> },
          { value: <OverallStatus providerId={item.id} providerType={providerType} isStatusMsg /> },
          { value: <ProviderDetailsModal providerId={item.id} providerType={providerType} showStatus={false} /> },
        ],
        item,
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [providers]);

  return <DataTable columns={columns} isActionsCell rows={rows} />;
};

export { ProviderDetailsTable };
