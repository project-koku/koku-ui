import { Progress, ProgressSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './ocpCloudReportSummaryItem.styles';

interface OcpCloudReportSummaryItemProps extends InjectedTranslateProps {
  formatValue: ValueFormatter;
  formatOptions?: FormatOptions;
  label: string;
  totalValue: number;
  units: string;
  value: number;
}

const OcpCloudReportSummaryItemBase: React.SFC<OcpCloudReportSummaryItemProps> = ({
  label,
  formatOptions,
  formatValue,
  t,
  totalValue,
  units,
  value,
}) => {
  const lookup = unitLookupKey(units);
  const unitsLabel = lookup !== 'usd' ? t(`units.${lookup}`) : undefined;

  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = Number(percent.toFixed(2));
  const percentLabel = t('percent_of_total', {
    percent: percentVal,
    units: unitsLabel,
    value: formatValue(value, units, formatOptions),
  });

  return (
    <li style={styles.reportSummaryItem}>
      <Progress
        label={percentLabel}
        value={percentVal}
        title={label}
        size={ProgressSize.sm}
      />
    </li>
  );
};

OcpCloudReportSummaryItemBase.defaultProps = {
  formatValue: v => v,
};

const OcpCloudReportSummaryItem = translate()(OcpCloudReportSummaryItemBase);

export { OcpCloudReportSummaryItem, OcpCloudReportSummaryItemProps };
