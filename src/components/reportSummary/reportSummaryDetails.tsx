import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import React from 'react';
import { styles } from './reportSummaryDetails.styles';

interface ReportSummaryDetailsProps {
  report: Report;
  label: string;
  description: string;
  formatValue?(value: number): string | number;
}

interface State {
  value: string | number;
}

class ReportSummaryDetails extends React.Component<ReportSummaryDetailsProps> {
  public static defaultProps = {
    formatValue: v => v as any,
  };

  public state: State = {
    value: '----',
  };

  public static getDerivedStateFromProps: React.GetDerivedStateFromProps<
    ReportSummaryDetailsProps,
    State
  > = (nextProps: ReportSummaryDetailsProps, prevState: State) => {
    if (nextProps.report) {
      const value = nextProps.formatValue(nextProps.report.total.value);
      return { value };
    }

    return null;
  };

  public render() {
    const { label, description } = this.props;
    const { value } = this.state;

    return (
      <div className={css(styles.reportSummaryDetails)}>
        <div className={css(styles.value)}>{value}</div>
        <div className={css(styles.text)}>
          <div>{label}</div>
          <div>{description}</div>
        </div>
      </div>
    );
  }
}

export { ReportSummaryDetails, ReportSummaryDetailsProps };
