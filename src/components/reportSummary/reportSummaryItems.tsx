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

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey,
      labelKey,
    });

    const otherIndex = computedItems.findIndex(i => i.id === 'Other');

    if (otherIndex !== -1) {
      return [
        ...computedItems.slice(0, otherIndex),
        ...computedItems.slice(otherIndex + 1),
        computedItems[otherIndex],
      ];
    }

    return computedItems;
  }

  public render() {
    const { report, children } = this.props;
    if (!report) {
      return null;
    }

    const items = this.getItems();

    return <ul>{children({ items })}</ul>;
  }
}

export {
  ReportSummaryItems,
  ReportSummaryItemsProps,
  ReportSummaryItemsRenderProps,
};
