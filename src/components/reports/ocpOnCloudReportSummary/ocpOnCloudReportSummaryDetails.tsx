import { css } from '@patternfly/react-styles';
import { OcpOnCloudReport, OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './ocpOnCloudReportSummaryDetails.styles';

interface OcpOnCloudReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpOnCloudReport;
  reportType?: OcpOnCloudReportType;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const OcpOnCloudReportSummaryDetailsBase: React.SFC<
  OcpOnCloudReportSummaryDetailsProps
> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = OcpOnCloudReportType.cost,
  requestFormatOptions,
  requestLabel,
  showUnits = false,
  showUsageFirst = false,
  t,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const cloudReportType =
    reportType === OcpOnCloudReportType.database ||
    reportType === OcpOnCloudReportType.instanceType ||
    reportType === OcpOnCloudReportType.network ||
    reportType === OcpOnCloudReportType.storage;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    if (cloudReportType) {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    } else {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
      request = formatValue(
        report.meta.total.request ? report.meta.total.request.value : 0,
        report.meta.total.request ? report.meta.total.request.units : '',
        requestFormatOptions ? usageFormatOptions : formatOptions
      );
    }
  }

  const getCostLayout = () => (
    <div className={css(styles.valueContainer)}>
      <div className={css(styles.value)}>{cost}</div>
      <div className={css(styles.text)}>
        <div>{costLabel}</div>
      </div>
    </div>
  );

  const getRequestLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string =
      report && report.meta && report.meta.total && report.meta.total.request
        ? report.meta.total.request.units
        : '';
    const _units = unitLookupKey(usageUnits);
    const unitsLabel = t(`units.${_units}`);

    return (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.value)}>
          {request}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.request &&
              report.meta.total.request.value >= 0
          ) && <span className={css(styles.text)}>{unitsLabel}</span>}
        </div>
        <div className={css(styles.text)}>
          <div>{requestLabel}</div>
        </div>
      </div>
    );
  };

  const getUsageLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string =
      report && report.meta && report.meta.total && report.meta.total.usage
        ? report.meta.total.usage.units
        : '';
    const _units = unitLookupKey(usageUnits);
    const unitsLabel = t(`units.${_units}`);

    return (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.value)}>
          {usage}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.usage &&
              report.meta.total.usage.value >= 0
          ) && <span className={css(styles.text)}>{unitsLabel}</span>}
        </div>
        <div className={css(styles.text)}>
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (reportType === OcpOnCloudReportType.cost) {
    return <>{getCostLayout()}</>;
  } else if (cloudReportType) {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getCostLayout()}
        </>
      );
    }
    return (
      <>
        {getCostLayout()}
        {getUsageLayout()}
      </>
    );
  } else {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getRequestLayout()}
        </>
      );
    }
    return (
      <>
        {getRequestLayout()}
        {getUsageLayout()}
      </>
    );
  }
};

const OcpOnCloudReportSummaryDetails = translate()(
  OcpOnCloudReportSummaryDetailsBase
);

export { OcpOnCloudReportSummaryDetails, OcpOnCloudReportSummaryDetailsProps };
