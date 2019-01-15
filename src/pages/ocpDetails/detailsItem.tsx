import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport } from 'api/ocpReports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { ocpReportsActions } from 'store/ocpReports';
import { formatCurrency } from 'utils/formatValue';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { getTestProps, testIds } from '../../testIds';
import { DetailsChart } from './detailsChart';
import { DetailsCluster } from './detailsCluster';
import { DetailsSummary } from './detailsSummary';
import { DetailsTag } from './detailsTag';
import { HistoricalModal } from './historicalModal';
import { styles } from './ocpDetails.styles';

interface DetailsItemOwnProps {
  charge: number;
  parentQuery: OcpQuery;
  parentGroupBy: any;
  item: ComputedOcpReportItem;
  onCheckboxChange(checked: boolean, item: ComputedOcpReportItem);
  onTagClicked(key: string, value: string);
  selected: boolean;
}

interface State {
  expanded: boolean;
  isHistoricalModalOpen: boolean;
}

interface DetailsItemStateProps {
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsItemDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsItemProps = DetailsItemOwnProps &
  DetailsItemStateProps &
  DetailsItemDispatchProps &
  InjectedTranslateProps;

class DetailsItemBase extends React.Component<DetailsItemProps> {
  public state: State = {
    expanded: false,
    isHistoricalModalOpen: false,
  };

  private getChargeQueryString(groupBy: string) {
    const { item, parentGroupBy, parentQuery } = this.props;
    const newQuery: OcpQuery = {
      ...parentQuery,
      delta: undefined,
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        limit: 5,
      },
      group_by: {
        [groupBy]: '*',
        [parentGroupBy]: item.label || item.id,
      },
      order_by: undefined,
    };
    return getQuery(newQuery);
  }

  private getQueryString(isMonthly: boolean = true, isCurrent: boolean = true) {
    const { item, parentGroupBy, parentQuery } = this.props;
    const newQuery: OcpQuery = {
      ...parentQuery,
      delta: undefined,
      filter: {
        time_scope_units: 'month',
        time_scope_value: isCurrent ? -1 : -2,
        resolution: isMonthly ? 'monthly' : 'daily',
        limit: 5,
      },
      group_by: { [parentGroupBy]: item.label || item.id },
      order_by: undefined,
    };
    return getQuery(newQuery);
  }

  public handleExpand = () => {
    this.setState({ expanded: true });
  };

  public handleExpandClose = () => {
    this.setState({ expanded: false });
  };

  public handleCheckboxChange = event => {
    const { item, onCheckboxChange } = this.props;
    onCheckboxChange(event.currentTarget.checked, item);
  };

  public handleHistoricalModalClose = (isOpen: boolean) => {
    this.setState({ isHistoricalModalOpen: isOpen });
  };

  public handleHistoricalModalOpen = () => {
    this.setState({ isHistoricalModalOpen: true });
  };

  public handleTagClicked = (key: string, value: string) => {
    const { onTagClicked } = this.props;
    onTagClicked(key, value);
  };

  public render() {
    const { charge, t, item, parentGroupBy, selected } = this.props;
    const { isHistoricalModalOpen } = this.state;

    const today = new Date();
    const date = today.getDate();
    const month = (((today.getMonth() - 1) % 12) + 12) % 12;

    const value = formatCurrency(Math.abs(item.deltaValue));
    const percentage =
      item.deltaPercent !== null ? Math.abs(item.deltaPercent).toFixed(2) : 0;

    let iconOverride = 'iconOverride';
    if (item.deltaPercent !== null && item.deltaValue < 0) {
      iconOverride += ' decrease';
    }
    if (item.deltaPercent !== null && item.deltaValue > 0) {
      iconOverride += ' increase';
    }

    return (
      <ListView.Item
        key={item.label}
        heading={item.label}
        checkboxInput={
          <input
            type="checkbox"
            checked={selected}
            onChange={this.handleCheckboxChange}
          />
        }
        additionalInfo={[
          <ListView.InfoItem key="1" stacked>
            <strong className={iconOverride}>
              {t('percent', { value: percentage })}
              {Boolean(item.deltaPercent !== null && item.deltaValue > 0) && (
                <span className={css('fa fa-sort-asc', styles.infoItemArrow)} />
              )}
              {Boolean(item.deltaPercent !== null && item.deltaValue < 0) && (
                <span
                  className={css(
                    'fa fa-sort-desc',
                    styles.infoItemArrow,
                    styles.descArrow
                  )}
                />
              )}
            </strong>
            <span>
              {(Boolean(item.deltaPercent !== null && item.deltaValue > 0) &&
                ((Boolean(date < 31) &&
                  t('ocp_details.increase_since_date', {
                    date,
                    month,
                    value,
                  })) ||
                  t('ocp_details.increase_since_last_month', {
                    date,
                    month,
                    value,
                  }))) ||
                (Boolean(item.deltaPercent !== null && item.deltaValue < 0) &&
                  ((Boolean(date < 31) &&
                    t('ocp_details.decrease_since_date', {
                      date,
                      month,
                      value,
                    })) ||
                    t('ocp_details.decrease_since_last_month', {
                      date,
                      month,
                      value,
                    }))) ||
                t('ocp_details.no_change_since_date', { date, month })}
            </span>
          </ListView.InfoItem>,
        ]}
        actions={[
          <ListView.InfoItem key="1" stacked>
            <strong>{formatCurrency(item.charge)}</strong>
            <span>
              {((item.charge / charge) * 100).toFixed(2)}
              {t('percent_of_charge')}
            </span>
          </ListView.InfoItem>,
        ]}
        onExpand={this.handleExpand}
        onExpandClose={this.handleExpandClose}
      >
        <Grid>
          <GridItem lg={12} xl={5}>
            <div className={css(styles.projectsContainer)}>
              {Boolean(parentGroupBy === 'project') && (
                <Form>
                  <DetailsCluster
                    label={t('ocp_details.cluster_label')}
                    idKey={'cluster'}
                    queryString={this.getChargeQueryString('cluster')}
                  />
                  <DetailsTag
                    label={t('ocp_details.tags_label')}
                    project={item.label || item.id}
                    onTagClicked={this.handleTagClicked}
                  />
                </Form>
              )}
              {Boolean(
                parentGroupBy === 'cluster' || parentGroupBy === 'node'
              ) && (
                <div className={css(styles.summaryContainer)}>
                  <DetailsSummary
                    idKey={'project'}
                    queryString={this.getChargeQueryString('project')}
                    title={t('ocp_details.historical.project_title')}
                  />
                </div>
              )}
            </div>
          </GridItem>
          <GridItem lg={12} xl={5}>
            <div className={css(styles.measureChartContainer)}>
              <DetailsChart queryString={this.getQueryString(true, true)} />
            </div>
          </GridItem>
          <GridItem lg={12} xl={2}>
            <div className={css(styles.historicalLinkContainer)}>
              <Button
                {...getTestProps(testIds.details.historical_data_btn)}
                onClick={this.handleHistoricalModalOpen}
                type={ButtonType.button}
                variant={ButtonVariant.secondary}
              >
                View Historical Data
              </Button>
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
          chargeTitle={t('ocp_details.historical.charge_title', {
            groupBy: parentGroupBy,
          })}
          cpuTitle={t('ocp_details.historical.cpu_title', {
            groupBy: parentGroupBy,
          })}
          currentQueryString={this.getQueryString(false, true)}
          memoryTitle={t('ocp_details.historical.memory_title', {
            groupBy: parentGroupBy,
          })}
          isOpen={isHistoricalModalOpen}
          onClose={this.handleHistoricalModalClose}
          previousQueryString={this.getQueryString(false, false)}
          title={t('ocp_details.historical.modal_title', {
            groupBy: parentGroupBy,
            name: item.label,
          })}
        />
      </ListView.Item>
    );
  }
}

const DetailsItem = translate()(connect()(DetailsItemBase));

export { DetailsItem, DetailsItemBase, DetailsItemProps };
