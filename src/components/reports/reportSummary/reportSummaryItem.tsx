import './reportSummaryItem.scss';

import { Progress, ProgressSize } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ValueFormatterOptions } from 'utils/valueFormatter';
import { formatCurrency, unitsLookupKey } from 'utils/valueFormatter';

interface ReportSummaryItemOwnProps {
  label: string;
  totalValue: number;
  units: string;
  value: number;
  valueFormatterOptions?: ValueFormatterOptions;
}

type ReportSummaryItemProps = ReportSummaryItemOwnProps & WrappedComponentProps;

const ReportSummaryItemBase: React.SFC<ReportSummaryItemProps> = ({
  intl,
  label,
  totalValue,
  units,
  value,
  valueFormatterOptions,
}) => {
  const unitsLabel = intl.formatMessage(messages.Units, { units: unitsLookupKey(units) });
  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = Number(percent.toFixed(2));
  const percentLabel = intl.formatMessage(messages.PercentTotalCost, {
    percent: percentVal,
    units: unitsLabel,
    value: formatCurrency(value, units, valueFormatterOptions),
  });

  return (
    <li className="reportSummaryItem">
      <Progress label={percentLabel} value={percentVal} title={label} size={ProgressSize.sm} />
    </li>
  );
};

const ReportSummaryItem = injectIntl(ReportSummaryItemBase);

export { ReportSummaryItem, ReportSummaryItemProps };
