import './reportSummaryItem.scss';

import { Progress, ProgressSize } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';

interface ReportSummaryItemOwnProps {
  formatValue: ValueFormatter;
  formatOptions?: FormatOptions;
  label: string;
  totalValue: number;
  units: string;
  value: number;
}

type ReportSummaryItemProps = ReportSummaryItemOwnProps & WrappedComponentProps;

const ReportSummaryItemBase: React.SFC<ReportSummaryItemProps> = ({
  intl,
  label,
  formatOptions,
  formatValue,
  totalValue,
  units,
  value,
}) => {
  const lookup = unitLookupKey(units);
  const unitsLabel = lookup !== 'usd' ? intl.formatMessage(messages.Units, { units: lookup }) : undefined;
  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = Number(percent.toFixed(2));
  const percentLabel = intl.formatMessage(messages.PercentTotalCost, {
    percent: percentVal,
    units: unitsLabel,
    value: formatValue(value, units, formatOptions),
  });

  return (
    <li className="reportSummaryItem">
      <Progress label={percentLabel} value={percentVal} title={label} size={ProgressSize.sm} />
    </li>
  );
};

ReportSummaryItemBase.defaultProps = {
  formatValue: v => v,
};

const ReportSummaryItem = injectIntl(ReportSummaryItemBase);

export { ReportSummaryItem, ReportSummaryItemProps };
