import { css } from '@patternfly/react-styles';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './ocpOnAwsReportSummaryDetails.styles';

interface OcpOnAwsReportSummaryDetailsProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpOnAwsReport;
  reportType?: OcpOnAwsReportType;
  requestLabel?: string;
  unitsLabel?: string;
  usageLabel?: string;
}

const OcpOnAwsReportSummaryDetails: React.SFC<
  OcpOnAwsReportSummaryDetailsProps
> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = OcpOnAwsReportType.cost,
  requestLabel,
  unitsLabel,
  usageLabel,
}) => {
  let cost: string | number = '----';
  let request: string | number = '----';
  let usage: string | number = '----';

  const awsReportType =
    reportType === OcpOnAwsReportType.database ||
    reportType === OcpOnAwsReportType.instanceType ||
    reportType === OcpOnAwsReportType.network ||
    reportType === OcpOnAwsReportType.storage;

  if (report && report.meta && report.meta.total) {
    const costUnits: string = report.meta.total.cost.units
      ? report.meta.total.cost.units
      : 'USD';
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      costUnits,
      formatOptions
    );

    if (awsReportType) {
      const usageUnits: string = report.meta.total.usage
        ? report.meta.total.usage.units
        : 'USD';
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        usageUnits,
        formatOptions
      );
    } else {
      const usageUnits: string = report.meta.total.usage
        ? report.meta.total.usage.units
        : 'GB';
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        usageUnits,
        formatOptions
      );
      request = formatValue(
        report.meta.total.request ? report.meta.total.request.value : 0,
        usageUnits,
        formatOptions
      );
    }
  }

  if (reportType === OcpOnAwsReportType.cost) {
    return (
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.value)}>{cost}</div>
      </div>
    );
  } else if (!awsReportType) {
    return (
      <>
        <div className={css(styles.titleContainer)}>
          <div className={css(styles.value, styles.usageValue)}>
            {usage}
            <div className={css(styles.text)}>
              <div>{usageLabel}</div>
            </div>
          </div>
        </div>
        <div className={css(styles.titleContainer)}>
          <div className={css(styles.value)}>
            {request}
            <div className={css(styles.text)}>{requestLabel}</div>
          </div>
        </div>
      </>
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

export { OcpOnAwsReportSummaryDetails, OcpOnAwsReportSummaryDetailsProps };
