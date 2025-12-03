import './breakdownHeader.scss';

import type { Query } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import type { TagPathsType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Popover,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { AngleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-left-icon';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createMapStateToProps } from '../../../../store/common';
import { getTotalCostDateRangeString } from '../../../../utils/dates';
import { formatCurrency } from '../../../../utils/format';
import { awsCategoryKey, orgUnitIdKey, tagKey } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { ComputedReportItemValueType } from '../../../components/charts/common';
import { CostDistribution } from '../../../components/costDistribution';
import { CostType } from '../../../components/costType';
import { Currency } from '../../../components/currency';
import { getActiveFilters, getChips } from '../../../components/dataToolbar/utils/common';
import { getGroupByCostCategory, getGroupByOrgValue, getGroupByTagKey } from '../../../utils/groupBy';
import { TagLink } from '../tag';
import { styles } from './breakdownHeader.styles';

interface BreakdownHeaderOwnProps extends RouterComponentProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  clusterInfoComponent?: React.ReactNode;
  costDistribution?: string;
  costType?: string;
  currency?: string;
  dataDetailsComponent?: React.ReactNode;
  detailsURL?: string;
  description?: string;
  groupBy?: string;
  onCostDistributionSelect(value: string);
  onCostTypeSelect(value: string);
  onCurrencySelect(value: string);
  query: Query;
  report: Report;
  showCostDistribution?: boolean;
  showCostType?: boolean;
  showCurrency?: boolean;
  tabs: React.ReactNode;
  tagPathsType: TagPathsType;
  timeScopeValue?: number;
  title: string;
}

interface BreakdownHeaderStateProps {
  // TBD...
}

interface BreakdownHeaderDispatchProps {
  // TBD...
}

interface BreakdownHeaderState {
  // TBD...
}

type BreakdownHeaderProps = BreakdownHeaderOwnProps & BreakdownHeaderStateProps & WrappedComponentProps;

class BreakdownHeader extends React.Component<BreakdownHeaderProps, any> {
  protected defaultState: BreakdownHeaderState = {};
  public state: BreakdownHeaderState = { ...this.defaultState };

  private getBackToLink = groupByKey => {
    const { breadcrumbLabel, breadcrumbPath, intl, router, tagPathsType } = this.props;

    if (!breadcrumbPath) {
      return null;
    }
    return (
      <Link to={breadcrumbPath} state={{ ...router.location.state }}>
        {breadcrumbLabel
          ? breadcrumbLabel
          : intl.formatMessage(messages.breakdownBackToDetails, {
              value: intl.formatMessage(messages.breakdownBackToTitles, { value: tagPathsType }),
              groupBy: groupByKey,
            })}
      </Link>
    );
  };

  private hasFilterBy = () => {
    const { groupBy, router } = this.props;
    const exclude = router.location.state?.details?.exclude;
    const filterBy = router.location.state?.details?.filter_by;
    return (
      (exclude && Object.keys(exclude).filter(key => key !== groupBy).length > 0) ||
      (filterBy && Object.keys(filterBy).filter(key => key !== groupBy).length > 0)
    );
  };

  private getFilterChips = () => {
    const { intl, router } = this.props;

    const filterBy = this.hasFilterBy() ? router.location.state?.details?.filter_by : undefined;
    if (!filterBy) {
      return null;
    }

    const getLabel = value => {
      const label = intl.formatMessage(messages.filterByValues, { value });
      return label !== '' ? label : value;
    };

    const filters = getActiveFilters(router.location.state?.details) as any;
    const filterChips = Object.keys(filters).map(key => {
      if (filters[key] instanceof Array) {
        const chips: any[] = getChips(filters[key]);
        return (
          <span key={key} style={styles.filterChip}>
            <LabelGroup categoryName={getLabel(key)}>
              {chips.map((chip, index) => (
                <Label variant="outline" key={`${key}-${index}`}>
                  {chip.node}
                </Label>
              ))}
            </LabelGroup>
          </span>
        );
      } else {
        return Object.keys(filters[key]).map(key2 => {
          const chips: any[] = getChips(filters[key][key2]);
          return (
            <span key={key2} style={styles.filterChip}>
              <LabelGroup categoryName={getLabel(key2)}>
                {chips.map((chip, index) => (
                  <Label variant="outline" key={`${key2}-${index}`}>
                    {chip.node}
                  </Label>
                ))}
              </LabelGroup>
            </span>
          );
        });
      }
    });
    return (
      <div style={styles.filteredByContainer}>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.filteredBy}>
          {intl.formatMessage(messages.filteredBy)}
        </Title>
        <span style={styles.infoIcon}>
          <Popover
            aria-label={intl.formatMessage(messages.overviewInfoArialLabel)}
            enableFlip
            bodyContent={<p>{intl.formatMessage(messages.filteredByWarning)}</p>}
          >
            <Button
              icon={<OutlinedQuestionCircleIcon />}
              aria-label={intl.formatMessage(messages.overviewInfoButtonArialLabel)}
              variant={ButtonVariant.plain}
            ></Button>
          </Popover>
        </span>
        {filterChips}
      </div>
    );
  };

  private getTotalCost = () => {
    const { costDistribution, report } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const hasCost = report?.meta?.total?.cost && report.meta.total.cost[reportItemValue];
    const cost = formatCurrency(
      hasCost ? report.meta.total.cost[reportItemValue].value : 0,
      hasCost ? report.meta.total.cost[reportItemValue].units : 'USD'
    );

    return cost;
  };

  public render() {
    const {
      clusterInfoComponent,
      costDistribution,
      costType,
      currency,
      dataDetailsComponent,
      description,
      groupBy,
      intl,
      onCostDistributionSelect,
      onCostTypeSelect,
      onCurrencySelect,
      query,
      showCostDistribution,
      showCostType,
      showCurrency,
      tabs,
      tagPathsType,
      timeScopeValue,
      title,
    } = this.props;

    const filterByAccount = query && query.filter ? query.filter.account : undefined;
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTag = getGroupByTagKey(query);
    const showTags =
      filterByAccount ||
      groupBy === 'account' ||
      groupBy === 'gcp_project' ||
      groupBy === 'payer_tenant_id' ||
      groupBy === 'project' ||
      groupBy === 'subscription_guid';

    // i18n groupBy key
    const groupByKey = filterByAccount
      ? 'account'
      : groupByCostCategory
        ? awsCategoryKey
        : groupByTag
          ? tagKey
          : groupByOrg
            ? orgUnitIdKey
            : groupBy;

    return (
      <header>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.headerContent}>
          <FlexItem>
            <nav
              aria-label={intl.formatMessage(messages.breakdownBackToDetailsAriaLabel)}
              className="breadcrumbOverride"
            >
              <ol className="pf-v6-c-breadcrumb__list">
                <li className="pf-v6-c-breadcrumb__item">
                  <span className="pf-v6-c-breadcrumb__item-divider">
                    <AngleLeftIcon />
                  </span>
                  {this.getBackToLink(groupByKey)}
                </li>
              </ol>
            </nav>
          </FlexItem>
          {showCurrency && (
            <FlexItem>
              <Currency currency={currency} onSelect={onCurrencySelect} />
            </FlexItem>
          )}
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            <Flex direction={{ default: 'column' }}>
              <Title headingLevel="h1" size={TitleSizes['2xl']}>
                {intl.formatMessage(messages.breakdownTitle, { value: title })}
              </Title>
              {(description || clusterInfoComponent) && (
                <FlexItem style={styles.description}>
                  {description}
                  {clusterInfoComponent && (
                    <span style={!description ? styles.clusterInfoContainer : undefined}>{clusterInfoComponent}</span>
                  )}
                </FlexItem>
              )}
              {dataDetailsComponent && <FlexItem>{dataDetailsComponent}</FlexItem>}
              {this.hasFilterBy() && <FlexItem>{this.getFilterChips()}</FlexItem>}
              {showCostDistribution && (
                <FlexItem style={styles.costDistribution}>
                  <CostDistribution costDistribution={costDistribution} onSelect={onCostDistributionSelect} />
                </FlexItem>
              )}
              {showCostType && (
                <FlexItem style={styles.costType}>
                  <CostType onSelect={onCostTypeSelect} costType={costType} />
                </FlexItem>
              )}
            </Flex>
          </FlexItem>
          <FlexItem>
            <div style={styles.costLabel}>
              <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                <span>{this.getTotalCost()}</span>
              </Title>
              <div style={styles.costLabelDate}>
                {getTotalCostDateRangeString(
                  intl.formatMessage(messages.groupByValuesTitleCase, { value: groupByKey, count: 2 }),
                  undefined,
                  timeScopeValue === -2 ? 1 : 0,
                  true
                )}
              </div>
            </div>
          </FlexItem>
        </Flex>
        <div className="pf-v6-c-tabs">
          <div style={styles.tabs}>
            {tabs}
            <div style={styles.tag}>{showTags && <TagLink id="tags" tagPathsType={tagPathsType} />}</div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = createMapStateToProps<BreakdownHeaderOwnProps, BreakdownHeaderStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: BreakdownHeaderDispatchProps = {
  // TDB
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownHeader)));
