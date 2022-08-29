import { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { getTestProps, testIds } from 'testIds';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';

import { styles } from './cluster.styles';
import { ClusterModal } from './clusterModal';

interface ClusterOwnProps {
  groupBy: string;
  report: Report;
}

interface ClusterState {
  isOpen: boolean;
  showAll: boolean;
}

type ClusterProps = ClusterOwnProps & WrappedComponentProps;

class ClusterBase extends React.Component<ClusterProps> {
  protected defaultState: ClusterState = {
    isOpen: false,
    showAll: false,
  };
  public state: ClusterState = { ...this.defaultState };

  constructor(props: ClusterProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { groupBy, report, intl } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someClusters = [];
    const allClusters = [];

    const computedItems = getComputedReportItems({
      report,
      idKey: groupBy as any,
    });

    const item = computedItems && computedItems.length ? computedItems[0] : undefined;
    if (!item) {
      return null;
    }

    for (const cluster of item.clusters) {
      const prefix = someClusters.length > 0 ? ', ' : '';
      const clusterString = `${prefix}${cluster}`;
      if (showAll) {
        someClusters.push(clusterString);
      } else if (charCount <= maxChars) {
        if (charCount + clusterString.length > maxChars) {
          someClusters.push(
            clusterString
              .slice(0, maxChars - charCount)
              .trim()
              .concat('...')
          );
        } else {
          someClusters.push(clusterString);
        }
      }
      charCount += clusterString.length;
      allClusters.push(cluster);
    }

    return (
      <div style={styles.clustersContainer}>
        {Boolean(someClusters) && someClusters.map((cluster, index) => <span key={index}>{cluster}</span>)}
        {Boolean(someClusters.length < allClusters.length) && (
          <a {...getTestProps(testIds.details.cluster_lnk)} href="#/" onClick={this.handleOpen}>
            {intl.formatMessage(messages.detailsMoreClusters, { value: allClusters.length - someClusters.length })}
          </a>
        )}
        <ClusterModal groupBy={groupBy} isOpen={isOpen} item={item} onClose={this.handleClose} />
      </div>
    );
  }
}

const Cluster = injectIntl(ClusterBase);

export { Cluster, ClusterProps };
