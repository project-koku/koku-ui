import { css } from '@patternfly/react-styles';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './ocpOnAwsReportSummaryDetails.styles';

interface OcpOnAwsReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpOnAwsReport;
  reportType?: OcpOnAwsReportType;
  requestLabel?: string;
  showUnits?: boolean;
  usageLabel?: string;
}

const OcpOnAwsReportSummaryDetailsBase: React.SFC<
  OcpOnAwsReportSummaryDetailsProps
> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = OcpOnAwsReportType.cost,
  requestLabel,
  showUnits = false,
  usageLabel,
  t,
}) => {
  let cost: string | number = '----';
  let request: string | number = '----';
  let usage: string | number = '----';

  const awsReportType =
    reportType === OcpOnAwsReportType.database ||
    reportType === OcpOnAwsReportType.instanceType ||
    reportType === OcpOnAwsReportType.network ||
    reportType === OcpOnAwsReportType.storage;

  const hasTotal = report && report.meta && report.meta.total;
  const costUnits: string =
    hasTotal && report.meta.total.cost ? report.meta.total.cost.units : 'USD';
  const usageUnits: string =
    hasTotal && report.meta.total.usage
      ? report.meta.total.usage.units
      : awsReportType
      ? 'GB'
      : 'USD';

  if (hasTotal) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      costUnits,
      formatOptions
    );
    if (awsReportType) {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        usageUnits,
        formatOptions
      );
    } else {
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
    const units = unitLookupKey(usageUnits);
    const unitsLabel = t(`units.${units}`);

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
              {usage}
              {Boolean(showUnits) && (
                <span className={css(styles.text)}>{unitsLabel}</span>
              )}
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

const OcpOnAwsReportSummaryDetails = translate()(
  OcpOnAwsReportSummaryDetailsBase
);

export { OcpOnAwsReportSummaryDetails, OcpOnAwsReportSummaryDetailsProps };
