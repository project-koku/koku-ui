import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/reports/ocpReports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import {
  FormatOptions,
  unitLookupKey,
  ValueFormatter,
} from 'utils/formatValue';
import { styles } from './ocpReportSummaryDetails.styles';

interface OcpReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpReport;
  reportType?: OcpReportType;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  units?: string;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const OcpReportSummaryDetailsBase: React.SFC<OcpReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = OcpReportType.cost,
  requestFormatOptions,
  requestLabel,
  showUnits = false,
  showUsageFirst = false,
  t,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    supplementaryCost = formatValue(
      report.meta.total.supplementary
        ? report.meta.total.supplementary.total.value
        : 0,
      report.meta.total.supplementary
        ? report.meta.total.supplementary.total.units
        : 'USD',
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
    if (reportType !== OcpReportType.cost) {
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
        content={t('ocp_dashboard.total_cost_tooltip', {
          supplementaryCost,
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

  if (reportType === OcpReportType.cost) {
    return <>{getCostLayout()}</>;
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

const OcpReportSummaryDetails = translate()(OcpReportSummaryDetailsBase);

export { OcpReportSummaryDetails, OcpReportSummaryDetailsProps };
