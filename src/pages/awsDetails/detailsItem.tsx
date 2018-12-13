import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReport } from 'api/awsReports';
import { Col, ListView, Row } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions } from 'store/awsReports';
import { FetchStatus } from 'store/common';
import { formatCurrency } from 'utils/formatValue';
import {
  ComputedAwsReportItem,
  GetComputedAwsReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/getComputedAwsReportItems';
import { styles } from './awsDetails.styles';
import { DetailsChart } from './detailsChart';

interface CostItemOwnProps {
  parentQuery: AwsQuery;
  parentGroupBy: any;
  item: ComputedAwsReportItem;
  onCheckboxChange(checked: boolean, item: ComputedAwsReportItem);
  selected: boolean;
  total: number;
}

interface State {
  expanded: boolean;
  currentGroupBy?: string;
}

interface CostItemStateProps {
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface CostItemDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type CostItemProps = CostItemOwnProps &
  CostItemStateProps &
  CostItemDispatchProps &
  InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: GetComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class CostItemBase extends React.Component<CostItemProps> {
  public state: State = {
    expanded: false,
  };

  private getQueryString(groupBy) {
    const { parentQuery, item } = this.props;
    const groupById = getIdKeyForGroupBy(parentQuery.group_by);
    const newQuery: AwsQuery = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        limit: 5,
      },
      group_by: { [groupById]: item.label, [groupBy]: '*' },
    };
    return getQuery(newQuery);
  }

  private getDefaultGroupBy() {
    const { parentGroupBy } = this.props;
    let groupBy = '';
    switch (parentGroupBy) {
      case 'account':
        groupBy = 'service';
        break;
      case 'service':
        groupBy = 'account';
        break;
      case 'region':
        groupBy = 'account';
        break;
    }
    return groupBy;
  }

  public componentDidMount() {
    const defaultGroupBy = this.getDefaultGroupBy();
    this.setState({ currentGroupBy: defaultGroupBy });
  }

  public componentDidUpdate(prevProps: CostItemProps) {
    if (this.props.parentGroupBy !== prevProps.parentGroupBy) {
      const defaultGroupBy = this.getDefaultGroupBy();
      this.setState({ currentGroupBy: defaultGroupBy });
    }
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

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const groupByKey: keyof AwsQuery['group_by'] = event.currentTarget
      .value as any;
    this.setState({ currentGroupBy: groupByKey });
  };

  public render() {
    const { t, item, parentGroupBy, selected, total } = this.props;
    const { currentGroupBy } = this.state;

    const today = new Date();
    const date = today.getDate();
    const month = (today.getMonth() - 1) % 12;

    const value = formatCurrency(Math.abs(item.deltaValue));
    const percentage =
      item.deltaValue !== null ? Math.abs(item.deltaPercent).toFixed(2) : 0;

    let iconOverride = 'iconOverride';
    if (item.deltaPercent !== null && item.deltaValue < 0) {
      iconOverride += ' decrease';
    }
    if (item.deltaPercent !== null && item.deltaValue > 0) {
      iconOverride += ' increase';
    }

    const queryString = this.getQueryString(currentGroupBy);

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
                  className={css('fa fa-sort-desc', styles.infoItemArrow)}
                />
              )}
            </strong>
            <span>
              {(Boolean(item.deltaPercent !== null && item.deltaValue > 0) &&
                ((Boolean(date < 31) &&
                  t('aws_details.increase_since_date', {
                    date,
                    month,
                    value,
                  })) ||
                  t('aws_details.increase_since_last_month', {
                    date,
                    month,
                    value,
                  }))) ||
                (Boolean(item.deltaPercent !== null && item.deltaValue < 0) &&
                  ((Boolean(date < 31) &&
                    t('aws_details.decrease_since_date', {
                      date,
                      month,
                      value,
                    })) ||
                    t('aws_details.decrease_since_last_month', {
                      date,
                      month,
                      value,
                    }))) ||
                t('aws_details.no_change_since_date', { date, month })}
            </span>
          </ListView.InfoItem>,
        ]}
        actions={[
          <ListView.InfoItem key="1" stacked>
            <strong>{formatCurrency(item.total)}</strong>
            <span>
              {((item.total / total) * 100).toFixed(2)}
              {t('percent_of_cost')}
            </span>
          </ListView.InfoItem>,
        ]}
        onExpand={this.handleExpand}
        onExpandClose={this.handleExpandClose}
      >
        <Row>
          <Col>
            <div>
              <div className={css(styles.innerGroupBySelector)}>
                <label className={css(styles.innerGroupBySelectorLabel)}>
                  {t('group_by.label')}:
                </label>
                <select
                  id={item.label ? item.label.toString() : ''}
                  onChange={this.handleSelectChange}
                >
                  {groupByOptions.map(option => {
                    if (option.value !== parentGroupBy) {
                      return (
                        <option key={option.value} value={option.value}>
                          {t(`group_by.values.${option.label}`)}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
              {Boolean(currentGroupBy) &&
                Boolean(queryString) && (
                  <DetailsChart
                    queryString={queryString}
                    currentGroupBy={currentGroupBy}
                  />
                )}
            </div>
          </Col>
        </Row>
      </ListView.Item>
    );
  }
}

const DetailsItem = translate()(connect()(CostItemBase));

export { DetailsItem, CostItemBase, CostItemProps };
