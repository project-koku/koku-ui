import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Cluster } from 'pages/details/components/cluster/cluster';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getTestProps, testIds } from 'testIds';
import { ComputedOcpCloudReportItem } from 'utils/computedReport/getComputedOcpCloudReportItems';
import { DetailsChart } from './detailsChart';
import { styles } from './detailsTableItem.styles';
import { DetailsTag } from './detailsTag';
import { DetailsWidget } from './detailsWidget';
import { HistoricalModal } from './historicalModal';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedOcpCloudReportItem;
}

interface DetailsTableItemState {
  isHistoricalModalOpen: boolean;
}

type DetailsTableItemProps = DetailsTableItemOwnProps & InjectedTranslateProps;

class DetailsTableItemBase extends React.Component<DetailsTableItemProps> {
  public state: DetailsTableItemState = {
    isHistoricalModalOpen: false,
  };

  constructor(props: DetailsTableItemProps) {
    super(props);
    this.handleHistoricalModalClose = this.handleHistoricalModalClose.bind(
      this
    );
    this.handleHistoricalModalOpen = this.handleHistoricalModalOpen.bind(this);
  }

  public handleHistoricalModalClose = (isOpen: boolean) => {
    this.setState({ isHistoricalModalOpen: isOpen });
  };

  public handleHistoricalModalOpen = () => {
    this.setState({ isHistoricalModalOpen: true });
  };

  public render() {
    const { item, groupBy, t } = this.props;
    const { isHistoricalModalOpen } = this.state;

    return (
      <>
        <Grid>
          <GridItem sm={12}>
            <div className={css(styles.historicalContainer)}>
              <Button
                {...getTestProps(testIds.details.historical_data_btn)}
                onClick={this.handleHistoricalModalOpen}
                type={ButtonType.button}
                variant={ButtonVariant.secondary}
              >
                {t('ocp_cloud_details.historical.view_data')}
              </Button>
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div className={css(styles.leftPane)}>
              {Boolean(groupBy !== 'cluster') && (
                <div className={css(styles.clusterContainer)}>
                  <Form>
                    <FormGroup
                      label={t('ocp_cloud_details.cluster_label')}
                      fieldId="cluster-name"
                    >
                      <Cluster groupBy={groupBy} item={item} />
                    </FormGroup>
                  </Form>
                </div>
              )}
              <DetailsWidget groupBy={groupBy} item={item} />
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div className={css(styles.rightPane)}>
              {Boolean(groupBy === 'project') && (
                <div className={css(styles.tagsContainer)}>
                  <Form>
                    <FormGroup
                      label={t('ocp_cloud_details.tags_label')}
                      fieldId="tags"
                    >
                      <DetailsTag
                        groupBy={groupBy}
                        id="tags"
                        item={item}
                        project={item.label || item.id}
                      />
                    </FormGroup>
                  </Form>
                </div>
              )}
              <DetailsChart groupBy={groupBy} item={item} />
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
          groupBy={groupBy}
          isOpen={isHistoricalModalOpen}
          item={item}
          onClose={this.handleHistoricalModalClose}
        />
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<DetailsTableItemOwnProps, {}>(
  state => {
    return {};
  }
);

const DetailsTableItem = translate()(
  connect(mapStateToProps, {})(DetailsTableItemBase)
);

export { DetailsTableItem, DetailsTableItemProps };
