import { css } from '@patternfly/react-styles';
import { getQuery, Query } from 'api/query';
import { Report } from 'api/reports';
import { Col, ListView, Row } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { reportsActions } from 'store/reports';
import { formatCurrency } from 'utils/formatValue';
import {
  ComputedReportItem,
  GetComputedReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/getComputedReportItems';
import { styles } from './costDetails.styles';
import { DetailsChart } from './detailChart';

interface DetailsItemOwnProps {
  parentQuery: Query;
  parentGroupBy: any;
  item: ComputedReportItem;
  total: number;
}

interface State {
  expanded: boolean;
  currentGroupBy?: string;
  queryString?: string;
}

interface DetailsItemStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface DetailsItemDispatchProps {
  fetchReport?: typeof reportsActions.fetchReport;
}

type DetailsItemProps = DetailsItemOwnProps &
  DetailsItemStateProps &
  DetailsItemDispatchProps &
  InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: GetComputedReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class DetailsItemBase extends React.Component<DetailsItemProps> {
  public state: State = {
    expanded: false,
  };

  private getQueryString(groupBy) {
    const { parentQuery, item } = this.props;
    const groupById = getIdKeyForGroupBy(parentQuery.group_by);
    const newQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        limit: 5,
      },
      group_by: { [groupById]: item.id, [groupBy]: '*' },
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
    const queryString = this.getQueryString(defaultGroupBy);
    this.setState({ currentGroupBy: defaultGroupBy, queryString });
  }

  public componentDidUpdate(prevProps: DetailsItemProps) {
    if (this.props.parentGroupBy !== prevProps.parentGroupBy) {
      const defaultGroupBy = this.getDefaultGroupBy();
      this.setState({ currentGroupBy: defaultGroupBy });
    }
  }

  public handleExpand = () => {
    const { currentGroupBy } = this.state;
    const queryString = this.getQueryString(currentGroupBy);
    this.setState({ expanded: true, queryString });
  };

  public handleExpandClose = () => {
    this.setState({ expanded: false });
  };

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const groupByKey: keyof Query['group_by'] = event.currentTarget
      .value as any;
    const queryString = this.getQueryString(groupByKey);
    this.setState({ currentGroupBy: groupByKey, queryString });
  };

  public render() {
    const { t, item, parentGroupBy, total } = this.props;
    const { currentGroupBy, queryString } = this.state;
    return (
      <ListView.Item
        key={item.label}
        heading={item.label}
        checkboxInput={<input type="checkbox" />}
        additionalInfo={[
          <ListView.InfoItem key="1" stacked>
            <strong>{formatCurrency(item.total)}</strong>
            <span>
              {((item.total / total) * 100).toFixed(2)}
              {t('percent_of_cost')}
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
                  id={item.label.toString()}
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

const DetailsItem = translate()(connect()(DetailsItemBase));

export { DetailsItem, DetailsItemBase, DetailsItemProps };
