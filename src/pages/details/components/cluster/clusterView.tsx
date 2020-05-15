import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface ClusterViewOwnProps {
  item: ComputedReportItem;
}

type ClusterViewProps = ClusterViewOwnProps & WrappedComponentProps;

class ClusterViewBase extends React.Component<ClusterViewProps> {
  public render() {
    const { item } = this.props;

    if (!item.clusters) {
      return null;
    }
    return item.clusters.map((cluster, index) => (
      <div key={`cluster-${index}`}>{cluster}</div>
    ));
  }
}

const ClusterView = injectIntl(connect()(ClusterViewBase));

export { ClusterView, ClusterViewBase };
