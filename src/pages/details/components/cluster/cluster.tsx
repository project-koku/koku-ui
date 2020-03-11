import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { styles } from './cluster.styles';
import { ClusterModal } from './clusterModal';

interface ClusterOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface ClusterState {
  isOpen: boolean;
  showAll: boolean;
}

type ClusterProps = ClusterOwnProps & InjectedTranslateProps;

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
    const { groupBy, item, t } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someClusters = [];
    const allClusters = [];

    if (item) {
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
    }

    return (
      <div className={css(styles.clustersContainer)}>
        {Boolean(someClusters) &&
          someClusters.map((cluster, index) => (
            <span key={index}>{cluster}</span>
          ))}
        {Boolean(someClusters.length < allClusters.length) && (
          <a
            {...getTestProps(testIds.details.cluster_lnk)}
            href="#/"
            onClick={this.handleOpen}
          >
            {t('details.more_clusters', {
              value: allClusters.length - someClusters.length,
            })}
          </a>
        )}
        <ClusterModal
          groupBy={groupBy}
          isOpen={isOpen}
          item={item}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

const Cluster = translate()(connect()(ClusterBase));

export { Cluster, ClusterProps };
