import { css } from '@patternfly/react-styles';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './awsReportSummaryDetails.styles';

interface AwsReportSummaryDetailsProps {
  costLabel?: string;
  report: AwsReport;
  reportType: AwsReportType;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  unitsLabel?: string;
  usageLabel?: string;
}

const AwsReportSummaryDetails: React.SFC<AwsReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = AwsReportType.cost,
  unitsLabel,
  usageLabel,
}) => {
  let cost: string | number = '----';
  let usage: string | number = '----';
  if (report && report.meta && report.meta.total) {
    const costUnits: string = report.meta.total.cost
      ? report.meta.total.cost.units
      : 'USD';
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      costUnits,
      formatOptions
    );
    const usageUnits: string = report.meta.total.usage
      ? report.meta.total.usage.units
      : 'USD';
    usage = formatValue(
      report.meta.total.usage ? report.meta.total.usage.value : 0,
      usageUnits,
      formatOptions
    );
  }

  if (reportType === AwsReportType.cost) {
    return (
      <div className={css(styles.reportSummaryDetails)}>
        <div className={css(styles.value)}>{cost}</div>
      </div>
    );
  } else {
    return (
      <>
        <div className={css(styles.valueContainer)}>
          <div className={css(styles.value)}>{cost}</div>
          <div className={css(styles.text)}>
            <div>{costLabel}</div>
          </div>
        </div>
        {Boolean(usageLabel) && (
          <div className={css(styles.valueContainer)}>
            <div className={css(styles.value)}>
              {usage} <span className={css(styles.text)}>{unitsLabel}</span>
            </div>
            <div className={css(styles.text)}>
              <div>{usageLabel}</div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export { AwsReportSummaryDetails, AwsReportSummaryDetailsProps };
