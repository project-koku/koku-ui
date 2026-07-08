import 'routes/components/dataTable/dataTable.scss';

import type { AssignedCostModel } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DataTable } from 'routes/components/dataTable';
import { formatPath } from 'utils/paths';

import { styles } from './costModelsTable.styles';

interface CostModelsTableOwnProps {
  costModels?: AssignedCostModel[];
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
}

type CostModelsTableProps = CostModelsTableOwnProps;

const CostModelsTable: React.FC<CostModelsTableProps> = ({ costModels, filterBy, isLoading }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!costModels) {
      return;
    }

    const newRows = [];
    const computedItems = costModels ?? [];

    const newColumns = [
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
      },
    ];

    computedItems.map(item => {
      const desc = item?.uuid ? <div style={styles.infoDescription}>{item.uuid}</div> : null;
      newRows.push({
        cells: [
          {
            value: (
              <>
                {item?.name && (
                  <Link to={`${formatPath(routes.costModelBreakdown.basePath)}/${item?.uuid}`}>{item.name}</Link>
                )}
                {desc}
              </>
            ),
          },
        ],
        item,
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, costModels]);

  return <DataTable columns={columns} filterBy={filterBy} isLoading={isLoading} rows={rows} />;
};

export { CostModelsTable };
