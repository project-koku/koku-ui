import './reportSummaryItem.scss';

import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Progress, ProgressSize } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { FormatOptions } from '../../../../utils/format';
import { formatCurrency, formatPercentage, unitsLookupKey } from '../../../../utils/format';

interface ReportSummaryItemOwnProps {
  label: string;
  totalValue: number;
  units: string;
  value: number;
  formatOptions?: FormatOptions;
}

export type ReportSummaryItemProps = ReportSummaryItemOwnProps & WrappedComponentProps;

const ReportSummaryItemBase: React.FC<ReportSummaryItemProps> = ({
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
      <Progress label={percentLabel} value={Number(percent)} title={label} size={ProgressSize.sm} />
    </li>
  );
};

const ReportSummaryItem = injectIntl(ReportSummaryItemBase);

export default ReportSummaryItem;
