import { Title, TitleSize } from '@patternfly/react-core';
import { AngleLeftIcon } from '@patternfly/react-icons';
import { getQueryRoute, Query } from 'api/queries/query';
import { Report, ReportPathsType } from 'api/reports/report';
import { TagLink } from 'pages/details/components/tag/tagLink';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getForDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';
import { breadcrumbOverride, styles } from './costHeader.styles';

interface CostHeaderOwnProps {
  detailsURL?: string;
  filterBy: string;
  groupBy?: string;
  query: Query;
  report: Report;
  reportPathsType: ReportPathsType;
  showTags?: boolean;
  tabs: React.ReactNode;
}

type CostHeaderProps = CostHeaderOwnProps & InjectedTranslateProps;

class CostHeaderBase extends React.Component<CostHeaderProps> {
  private buildDetailsLink = () => {
    const { detailsURL, groupBy, query } = this.props;

    const newQuery = {
      ...query,
      group_by: {
        [groupBy]: '*',
      },
    };
    return `${detailsURL}?${getQueryRoute(newQuery)}`;
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
      filterBy,
      groupBy,
      reportPathsType,
      showTags,
      tabs,
      t,
    } = this.props;

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
                  {t('cost_details.back_to_details', {
                    groupBy,
                    value: reportPathsType,
                  })}
                </Link>
              </li>
            </ol>
          </nav>
          <Title style={styles.title} size={TitleSize['2xl']}>
            {t('cost_details.title', { value: filterBy })}
          </Title>
          <div style={styles.tabs}>
            {tabs}
            <div style={styles.tag}>
              {Boolean(showTags) && (
                <TagLink
                  filterBy={filterBy}
                  groupBy={groupBy}
                  id="tags"
                  reportPathsType={reportPathsType}
                />
              )}
            </div>
          </div>
        </div>
        <div style={styles.cost}>
          <div style={styles.costLabel}>
            <Title style={styles.costValue} size="4xl">
              <span>{this.getTotalCost()}</span>
            </Title>
          </div>
          <div style={styles.costLabelDate}>
            {getForDateRangeString(groupBy, 'cost_details.total_cost_date')}
          </div>
        </div>
      </header>
    );
  }
}

const CostHeader = translate()(CostHeaderBase);

export { CostHeader, CostHeaderProps };
