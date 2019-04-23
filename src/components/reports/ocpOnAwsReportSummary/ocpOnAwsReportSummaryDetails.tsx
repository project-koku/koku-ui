import { css } from '@patternfly/react-styles';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
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
  t,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const awsReportType =
    reportType === OcpOnAwsReportType.database ||
    reportType === OcpOnAwsReportType.instanceType ||
    reportType === OcpOnAwsReportType.network ||
    reportType === OcpOnAwsReportType.storage;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    if (awsReportType) {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        formatOptions
      );
    } else {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        formatOptions
      );
      request = formatValue(
        report.meta.total.request ? report.meta.total.request.value : 0,
        report.meta.total.request ? report.meta.total.request.units : '',
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
    const usageUnits =
      report && report.meta && report.meta.total && report.meta.total.usage
        ? report.meta.total.usage.units
        : '';
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
              {Boolean(showUnits && usage >= 0) && (
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
