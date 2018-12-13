import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport } from 'api/ocpReports';
import { Col, ListView, Row } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { ocpReportsActions } from 'store/ocpReports';
import { formatCurrency } from 'utils/formatValue';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { DetailsChart } from './detailsChart';
import { styles } from './ocpDetails.styles';

interface DetailsItemOwnProps {
  charge: number;
  parentQuery: OcpQuery;
  parentGroupBy: any;
  item: ComputedOcpReportItem;
  onCheckboxChange(checked: boolean, item: ComputedOcpReportItem);
  selected: boolean;
}

interface State {
  expanded: boolean;
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
  };

  private getQueryString() {
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
      group_by: { [parentGroupBy]: item.id },
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

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const groupByKey: keyof OcpQuery['group_by'] = event.currentTarget
      .value as any;
    this.setState({ currentGroupBy: groupByKey });
  };

  public render() {
    const { charge, t, item, parentGroupBy, selected } = this.props;

    const today = new Date();
    const date = today.getDate();
    const month = (today.getMonth() - 1) % 12;

    const value = formatCurrency(Math.abs(item.deltaValue));
    const percentage = Math.abs(item.deltaPercent).toFixed(2);

    let iconOverride = 'iconOverride';
    if (item.deltaValue < 0) {
      iconOverride += ' decrease';
    }
    if (item.deltaValue > 0) {
      iconOverride += ' increase';
    }

    const queryString = this.getQueryString();

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
              {Boolean(item.deltaValue > 0) && (
                <span className={css('fa fa-sort-asc', styles.infoItemArrow)} />
              )}
              {Boolean(item.deltaValue < 0) && (
                <span
                  className={css('fa fa-sort-desc', styles.infoItemArrow)}
                />
              )}
            </strong>
            <span>
              {(Boolean(item.deltaValue > 0) &&
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
                (Boolean(item.deltaValue < 0) &&
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
        <Row>
          <Col>
            {Boolean(queryString) && (
              <DetailsChart
                queryString={queryString}
                currentGroupBy={parentGroupBy}
              />
            )}
          </Col>
        </Row>
      </ListView.Item>
    );
  }
}

const DetailsItem = translate()(connect()(DetailsItemBase));

export { DetailsItem, DetailsItemBase, DetailsItemProps };
