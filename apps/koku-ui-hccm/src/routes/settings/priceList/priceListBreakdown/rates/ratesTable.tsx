import 'routes/components/dataTable/dataTable.scss';

import type { PriceListData } from 'api/priceList';
import type { Rate, TagValue } from 'api/rates';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { CompoundExpandTable } from 'routes/components/dataTable';
import { RateActions } from 'routes/settings/priceList/priceListBreakdown/rates/components/actions';
import { formatCurrencyRate } from 'utils/format';

import { styles } from './ratesTable.styles';

interface RatesTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isDispatch?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
  onSort(sortType: string, isSortAscending: boolean);
  onSuccess?: () => void;
  orderBy?: any;
  priceList: PriceListData; // Price list without filters and pagination for editing
  rates: Rate[]; // Filtered and paginated rates
}

type RatesTableProps = RatesTableOwnProps;

const RatesTable: React.FC<RatesTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isDispatch,
  isLoading,
  onClose,
  onDelete,
  onEdit,
  onSort,
  onSuccess,
  orderBy,
  priceList,
  rates,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!rates) {
      return;
    }

    const newRows = [];
    const computedItems = rates ?? [];

    const newColumns = [
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'description' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'metric' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'measurement' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cost_type' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'rate' }),
      },
      {
        isActionsCell: true,
        name: '', // Actions column
      },
    ];

    const gpuColumns = [
      {
        name: intl.formatMessage(messages.costModelsGpuVendor),
      },
      {
        name: intl.formatMessage(messages.costModelsGpuModel),
      },
      {
        name: intl.formatMessage(messages.rate),
      },
      {
        name: intl.formatMessage(messages.description),
      },
      {
        name: <span>&nbsp;</span>,
      },
    ];

    const tagColumns = [
      {
        name: intl.formatMessage(messages.costModelsTagRateTableKey),
      },
      {
        name: intl.formatMessage(messages.costModelsTagRateTableValue),
      },
      {
        name: intl.formatMessage(messages.rate),
      },
      {
        name: intl.formatMessage(messages.description),
      },
      {
        name: intl.formatMessage(messages.default),
      },
    ];

    computedItems.map((item, index) => {
      let children;
      const isTagRates = item?.tag_rates?.tag_values?.length > 0;
      const isTieredRates = item?.tiered_rates?.length > 0;
      const isGpuRates = item?.metric?.label_metric
        ? item?.metric?.label_metric?.toLowerCase() === 'gpu'
        : (item?.metric?.name?.toLowerCase()?.includes('gpu_') ?? false); // name looks like "gpu_cost_per_month"

      if (isTagRates) {
        if (isGpuRates) {
          children = {
            columns: gpuColumns,
            rows: [],
          };
          item?.tag_rates?.tag_values?.map((tagValue: TagValue, tagValuesIndex: number) => {
            children.rows.push({
              cells: [
                {
                  value: tagValuesIndex === 0 ? item?.tag_rates?.tag_key : '',
                },
                {
                  value: tagValue.tag_value,
                },
                {
                  value: formatCurrencyRate(Number(tagValue.value || 0), tagValue.unit || 'USD'),
                },
                {
                  value: tagValue.description,
                },
                {
                  value: '',
                },
              ],
            });
          });
        } else {
          children = {
            columns: tagColumns,
            rows: [],
          };
          item?.tag_rates?.tag_values?.map((tagValue, tagValuesIndex) => {
            children.rows.push({
              cells: [
                {
                  value: tagValuesIndex === 0 ? item?.tag_rates?.tag_key : '',
                },
                {
                  value: tagValue.tag_value,
                },
                {
                  value: formatCurrencyRate(Number(tagValue.value || 0), tagValue.unit || 'USD'),
                },
                {
                  value: tagValue.description,
                },
                {
                  value: tagValue.default ? intl.formatMessage(messages.yes) : intl.formatMessage(messages.no),
                },
              ],
            });
          });
        }
      }

      newRows.push({
        cells: [
          {
            style: styles.column,
            value: item?.custom_name || '',
          },
          {
            style: styles.column,
            value: item?.description || '',
          },
          {
            style: styles.column,
            value: item?.metric?.label_metric || '',
          },
          {
            style: styles.column,
            value: intl.formatMessage(messages.measurementValues, {
              value: (item?.metric?.label_measurement || '').toLowerCase().replace('-', '_'),
              units: item?.metric?.label_measurement_unit || '',
              count: 2,
            }),
          },
          {
            style: styles.column,
            value: item?.cost_type || '',
          },
          {
            isCompoundExpand: isTagRates,
            style: styles.column,
            value: isTagRates
              ? intl.formatMessage(messages.various)
              : isTieredRates
                ? formatCurrencyRate(item?.tiered_rates[0]?.value || 0, item?.tiered_rates[0]?.unit || 'USD')
                : '',
          },
          {
            isActionsCell: true,
            value: (
              <RateActions
                canWrite={canWrite}
                isDisabled={isDisabled}
                isDispatch={isDispatch}
                priceList={priceList}
                onClose={onClose}
                onDelete={onDelete}
                onEdit={onEdit}
                onSuccess={onSuccess}
                rateIndex={item?.rateIndex ?? index}
              />
            ),
          },
        ],
        ...(children && { children }),
        item,
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, priceList, rates]);

  return (
    <CompoundExpandTable
      columns={columns}
      filterBy={filterBy}
      isLoading={isLoading}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { RatesTable };
