import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';
import {
  ComputedReportItem,
  getComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import { styles } from './ocpCloudReportSummaryItems.styles';

interface OcpCloudReportSummaryItemsRenderProps {
  items: ComputedReportItem[];
}

interface OcpCloudReportSummaryItemsOwnProps
  extends ComputedOcpCloudReportItemsParams {
  children?(props: OcpCloudReportSummaryItemsRenderProps): React.ReactNode;
  status: number;
}

type OcpCloudReportSummaryItemsProps = OcpCloudReportSummaryItemsOwnProps &
  InjectedTranslateProps;

class OcpCloudReportSummaryItemsBase extends React.Component<
  OcpCloudReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: OcpCloudReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedReportItems({
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
    const { children, status } = this.props;

    if (status === FetchStatus.inProgress) {
      return (
        <>
          <Skeleton size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
        </>
      );
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const OcpCloudReportSummaryItems = translate()(OcpCloudReportSummaryItemsBase);

export {
  OcpCloudReportSummaryItems,
  OcpCloudReportSummaryItemsProps,
  OcpCloudReportSummaryItemsRenderProps,
};
