import React from 'react';
import {
  ComputedReportItem,
  getComputedReportItems,
  GetComputedReportItemsParams,
} from 'utils/getComputedReportItems';

interface ReportSummaryItemsRenderProps {
  items: ComputedReportItem[];
}

interface ReportSummaryItemsProps extends GetComputedReportItemsParams {
  children?(props: ReportSummaryItemsRenderProps): React.ReactNode;
}

class ReportSummaryItems extends React.Component<ReportSummaryItemsProps> {
  public shouldComponentUpdate(nextProps: ReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  public render() {
    const { report, idKey, labelKey, children } = this.props;
    if (!report) {
      return null;
    }

    const items = getComputedReportItems({
      report,
      idKey,
      labelKey,
    });

    return <ul>{children({ items })}</ul>;
  }
}

export {
  ReportSummaryItems,
  ReportSummaryItemsProps,
  ReportSummaryItemsRenderProps,
};
