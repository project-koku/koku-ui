import { Title } from '@patternfly/react-core';
import { AngleLeftIcon } from '@patternfly/react-icons/dist/js/icons/angle-left-icon';
import {
  breakdownDescKey,
  breakdownTitleKey,
  getQueryRoute,
  orgUnitIdKey,
  Query,
} from 'api/queries/query';
import { Report, ReportPathsType } from 'api/reports/report';
import { TagLink } from 'pages/details/components/tag/tagLink';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getForDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';
import { breadcrumbOverride, styles } from './breakdownHeader.styles';

interface BreakdownHeaderOwnProps {
  filterBy: string | number;
  detailsURL?: string;
  description?: string;
  groupBy?: string;
  query: Query;
  report: Report;
  reportPathsType: ReportPathsType;
  tabs: React.ReactNode;
  title: string;
}

type BreakdownHeaderProps = BreakdownHeaderOwnProps & InjectedTranslateProps;

class BreakdownHeaderBase extends React.Component<BreakdownHeaderProps> {
  private buildDetailsLink = () => {
    const { detailsURL, groupBy, query } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Retrieve org unit used by the details page
    if (query[orgUnitIdKey]) {
      groupByKey = orgUnitIdKey;
      value = query[orgUnitIdKey];
    }

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: value,
      },
    };
    // Don't want these params when returning to the details page
    if (newQuery.filter) {
      newQuery.filter.account = undefined;
      newQuery[breakdownDescKey] = undefined;
      newQuery[orgUnitIdKey] = undefined;
      newQuery[breakdownTitleKey] = undefined;
    }
    return `${detailsURL}?${getQueryRoute(newQuery)}`;
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      if (groupBy === orgUnitIdKey) {
        groupByOrg = query.group_by[orgUnitIdKey];
        break;
      }
    }
    return groupByOrg;
  };

  private getTotalCost = () => {
    const { report } = this.props;

    const hasCost =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;
    const cost = formatValue(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD'
    );

    return cost;
  };

  public render() {
    const {
      description,
      filterBy,
      groupBy,
      reportPathsType,
      t,
      tabs,
      title,
      query,
    } = this.props;

    const filterByAccount =
      query && query.filter ? query.filter.account : undefined;
    const groupByOrg = this.getGroupByOrg();
    const showTags =
      filterByAccount ||
      groupBy === 'account' ||
      groupBy === 'project' ||
      groupBy === 'subscription_guid';

    // i18n groupBy key
    const groupByKey = groupBy
      ? groupBy
      : filterByAccount
      ? 'account'
      : groupByOrg
      ? orgUnitIdKey
      : undefined;

    return (
      <header style={styles.header}>
        <div>
          <nav
            aria-label="breadcrumb"
            className={`pf-c-breadcrumb ${breadcrumbOverride}`}
          >
            <ol className="pf-c-breadcrumb__list">
              <li className="pf-c-breadcrumb__item">
                <span className="pf-c-breadcrumb__item-divider">
                  <AngleLeftIcon />
                </span>
                <Link to={this.buildDetailsLink()}>
                  {t('breakdown.back_to_details', {
                    groupBy: groupByKey,
                    value: reportPathsType,
                  })}
                </Link>
              </li>
            </ol>
          </nav>
          <Title headingLevel="h2" style={styles.title} size="xl">
            {t('breakdown.title', { value: title })}
            {description && (
              <div style={styles.infoDescription}>{description}</div>
            )}
          </Title>
          <div style={styles.tabs}>
            {tabs}
            <div style={styles.tag}>
              {Boolean(showTags) && (
                <TagLink
                  filterBy={filterBy}
                  groupBy={groupByKey}
                  id="tags"
                  reportPathsType={reportPathsType}
                />
              )}
            </div>
          </div>
        </div>
        <div style={styles.cost}>
          <div style={styles.costLabel}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              <span>{this.getTotalCost()}</span>
            </Title>
          </div>
          <div style={styles.costLabelDate}>
            {getForDateRangeString(groupByKey, 'breakdown.total_cost_date')}
          </div>
        </div>
      </header>
    );
  }
}

const BreakdownHeader = translate()(BreakdownHeaderBase);

export { BreakdownHeader, BreakdownHeaderProps };
