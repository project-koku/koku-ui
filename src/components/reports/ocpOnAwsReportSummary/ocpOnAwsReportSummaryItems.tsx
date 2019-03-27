import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import {
  ComputedOcpOnAwsReportItem,
  getComputedOcpOnAwsReportItems,
  GetComputedOcpOnAwsReportItemsParams,
} from 'utils/getComputedOcpOnAwsReportItems';

interface OcpOnAwsReportSummaryItemsRenderProps {
  items: ComputedOcpOnAwsReportItem[];
}

interface OcpOnAwsReportSummaryItemsOwnProps
  extends GetComputedOcpOnAwsReportItemsParams {
  children?(props: OcpOnAwsReportSummaryItemsRenderProps): React.ReactNode;
}

type OcpOnAwsReportSummaryItemsProps = OcpOnAwsReportSummaryItemsOwnProps &
  InjectedTranslateProps;

class OcpOnAwsReportSummaryItemsBase extends React.Component<
  OcpOnAwsReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: OcpOnAwsReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedOcpOnAwsReportItems({
      report,
      idKey,
      labelKey,
    });

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

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
    const { report, children, t } = this.props;

    if (!report) {
      return `${t('loading')}...`;
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const OcpOnAwsReportSummaryItems = translate()(OcpOnAwsReportSummaryItemsBase);

export {
  OcpOnAwsReportSummaryItems,
  OcpOnAwsReportSummaryItemsProps,
  OcpOnAwsReportSummaryItemsRenderProps,
};
