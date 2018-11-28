import React from 'react';
import {
  ComputedAwsReportItem,
  getComputedAwsReportItems,
  GetComputedAwsReportItemsParams,
} from 'utils/getComputedAwsReportItems';

interface AwsReportSummaryItemsRenderProps {
  items: ComputedAwsReportItem[];
}

interface AwsReportSummaryItemsProps extends GetComputedAwsReportItemsParams {
  children?(props: AwsReportSummaryItemsRenderProps): React.ReactNode;
}

class AwsReportSummaryItems extends React.Component<
  AwsReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: AwsReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedAwsReportItems({
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
  AwsReportSummaryItems,
  AwsReportSummaryItemsProps,
  AwsReportSummaryItemsRenderProps,
};
