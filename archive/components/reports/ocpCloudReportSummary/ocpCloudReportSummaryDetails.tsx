import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  OcpCloudReport,
  OcpCloudReportType,
} from 'api/reports/ocpCloudReports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './ocpCloudReportSummaryDetails.styles';

interface OcpCloudReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpCloudReport;
  reportType?: OcpCloudReportType;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const OcpCloudReportSummaryDetailsBase: React.SFC<OcpCloudReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = OcpCloudReportType.cost,
  requestFormatOptions,
  requestLabel,
  showUnits = false,
  showUsageFirst = false,
  t,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const cloudReportType =
    reportType === OcpCloudReportType.database ||
    reportType === OcpCloudReportType.instanceType ||
    reportType === OcpCloudReportType.network ||
    reportType === OcpCloudReportType.storage;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    infrastructureCost = formatValue(
      report.meta.total.infrastructure.total.value
        ? report.meta.total.infrastructure.total.value
        : 0,
      report.meta.total.infrastructure.total.units
        ? report.meta.total.infrastructure.total.units
        : 'USD',
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
    <div style={styles.valueContainer}>
      <Tooltip
        content={t('ocp_cloud_dashboard.total_cost_tooltip', {
          infrastructureCost,
        })}
        enableFlip
      >
        <div style={styles.value}>{cost}</div>
      </Tooltip>
      <div style={styles.text}>
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
      <div style={styles.valueContainer}>
        <div style={styles.value}>
          {request}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.request &&
              report.meta.total.request.value >= 0
          ) && <span style={styles.text}>{unitsLabel}</span>}
        </div>
        <div style={styles.text}>
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
      <div style={styles.valueContainer}>
        <div style={styles.value}>
          {usage}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.usage &&
              report.meta.total.usage.value >= 0
          ) && <span style={styles.text}>{unitsLabel}</span>}
        </div>
        <div style={styles.text}>
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (reportType === OcpCloudReportType.cost) {
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

const OcpCloudReportSummaryDetails = translate()(
  OcpCloudReportSummaryDetailsBase
);

export { OcpCloudReportSummaryDetails, OcpCloudReportSummaryDetailsProps };
