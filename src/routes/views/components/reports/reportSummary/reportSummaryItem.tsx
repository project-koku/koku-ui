import './reportSummaryItem.scss';

import { Progress, ProgressSize } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FormatOptions } from 'utils/format';
import { formatCurrency, formatPercentage, unitsLookupKey } from 'utils/format';

interface ReportSummaryItemOwnProps {
  label: string;
  totalValue: number;
  units: string;
  value: number;
  formatOptions?: FormatOptions;
}

type ReportSummaryItemProps = ReportSummaryItemOwnProps & WrappedComponentProps;

const ReportSummaryItemBase: React.SFC<ReportSummaryItemProps> = ({
  intl = defaultIntl, // Default required for testing
  label,
  totalValue,
  units,
  value,
  formatOptions,
}) => {
  const unitsLabel = intl.formatMessage(messages.units, { units: unitsLookupKey(units) });
  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = formatPercentage(percent);
  const percentLabel = intl.formatMessage(messages.percentTotalCost, {
    percent: percentVal,
    units: unitsLabel,
    value: formatCurrency(value, units, formatOptions),
  });

  return (
    <li className="reportSummaryItem">
      <Progress label={percentLabel} value={Number(percentVal)} title={label} size={ProgressSize.sm} />
    </li>
  );
};

const ReportSummaryItem = injectIntl(ReportSummaryItemBase);

export { ReportSummaryItem, ReportSummaryItemProps };
