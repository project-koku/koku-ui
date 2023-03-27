import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import { BulletChart } from 'routes/details/components/bulletChart/bulletChart';
import { Cluster } from 'routes/details/components/cluster/cluster';
import { HistoricalModal } from 'routes/details/components/historicalData/historicalModal';
import { Tag } from 'routes/details/components/tag/tag';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { DetailsSummary } from './detailsSummary';
import { styles } from './detailsTableItem.styles';
import { HistoricalChart } from './historicalChart';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsTableItemState {
  isHistoricalModalOpen: boolean;
}

type DetailsTableItemProps = DetailsTableItemOwnProps & InjectedTranslateProps;

const reportPathsType = ReportPathsType.ocpCloud;

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
            <div style={styles.historicalContainer}>
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
            <div style={styles.leftPane}>
              {Boolean(groupBy !== 'cluster') && (
                <div style={styles.clusterContainer}>
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
              <DetailsSummary
                filterBy={item.label || item.id}
                groupBy={groupBy}
                reportPathsType={reportPathsType}
              />
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div style={styles.rightPane}>
              {Boolean(groupBy === 'project') && (
                <div style={styles.tagsContainer}>
                  <Form>
                    <FormGroup
                      label={t('ocp_cloud_details.tags_label')}
                      fieldId="tags"
                    >
                      <Tag
                        filterBy={item.label || item.id}
                        groupBy={groupBy}
                        id="tags"
                        reportPathsType={reportPathsType}
                      />
                    </FormGroup>
                  </Form>
                </div>
              )}
              <BulletChart
                groupBy={groupBy}
                item={item}
                reportPathsType={reportPathsType}
              />
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
          chartComponent={<HistoricalChart />}
          filterBy={item.label || item.id}
          groupBy={groupBy}
          isOpen={isHistoricalModalOpen}
          onClose={this.handleHistoricalModalClose}
          reportPathsType={reportPathsType}
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
