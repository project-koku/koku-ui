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
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import { ComputedOcpOnAwsReportItem } from 'utils/getComputedOcpOnAwsReportItems';
import { DetailsChart } from './detailsChart';
import { DetailsCluster } from './detailsCluster';
import { DetailsSummary } from './detailsSummary';
import { styles } from './detailsTableItem.styles';
import { DetailsTag } from './detailsTag';
import { HistoricalModal } from './historicalModal';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
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
          <GridItem md={12} lg={3}>
            <div className={css(styles.projectsContainer)}>
              {Boolean(groupBy === 'project') && (
                <Form>
                  <FormGroup
                    label={t('ocp_on_aws_details.cluster_label')}
                    fieldId="cluster-name"
                  >
                    <DetailsCluster groupBy={groupBy} item={item} />
                  </FormGroup>
                  <FormGroup
                    label={t('ocp_on_aws_details.tags_label')}
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
              )}
              {Boolean(groupBy === 'cluster' || groupBy === 'node') && (
                <div className={css(styles.summaryContainer)}>
                  <DetailsSummary groupBy={groupBy} item={item} />
                </div>
              )}
            </div>
          </GridItem>
          <GridItem md={12} lg={6}>
            <div className={css(styles.measureChartContainer)}>
              <DetailsChart groupBy={groupBy} item={item} />
            </div>
          </GridItem>
          <GridItem md={12} lg={3}>
            <div className={css(styles.historicalLinkContainer)}>
              <Button
                {...getTestProps(testIds.details.historical_data_btn)}
                onClick={this.handleHistoricalModalOpen}
                type={ButtonType.button}
                variant={ButtonVariant.secondary}
              >
                {t('ocp_on_aws_details.historical.view_data')}
              </Button>
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

const DetailsTableItem = translate()(connect()(DetailsTableItemBase));

export { DetailsTableItem, DetailsTableItemProps };
