import { ToolbarChipGroup } from '@patternfly/react-core';
import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { getQuery, orgUnitIdKey, Query, tagKey } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { DataToolbar } from 'pages/details/components/dataToolbar/dataToolbar';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';
import { isEqual } from 'utils/equal';

import { styles } from './explorerFilter.styles';

interface ExplorerFilterOwnProps {
  groupBy: string;
  isDisabled?: boolean;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: Query;
  queryString?: string;
}

interface ExplorerFilterStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface ExplorerFilterDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface ExplorerFilterState {
  categoryOptions?: ToolbarChipGroup[];
}

type ExplorerFilterProps = ExplorerFilterOwnProps &
  ExplorerFilterStateProps &
  ExplorerFilterDispatchProps &
  WithTranslation;

const orgReportPathsType = OrgPathsType.aws;
const orgReportType = OrgType.org;
const tagReportPathsType = TagPathsType.aws;
const tagReportType = TagType.tag;

export class ExplorerFilterBase extends React.Component<ExplorerFilterProps> {
  protected defaultState: ExplorerFilterState = {};
  public state: ExplorerFilterState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchOrg, fetchTag, queryString } = this.props;
    fetchOrg(orgReportPathsType, orgReportType, queryString);
    fetchTag(tagReportPathsType, tagReportType, queryString);
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  public componentDidUpdate(prevProps: ExplorerFilterProps) {
    const { fetchOrg, fetchTag, orgReport, query, queryString, tagReport } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchOrg(orgReportPathsType, orgReportType, queryString);
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { orgReport, t, tagReport } = this.props;

    const options = [
      { name: t('filter_by.values.account'), key: 'account' },
      { name: t('filter_by.values.service'), key: 'service' },
      { name: t('filter_by.values.region'), key: 'region' },
    ];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      options.push({
        name: t('filter_by.values.org_unit_id'),
        key: orgUnitIdKey,
      });
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      options.push({ name: t('filter_by.values.tag'), key: tagKey });
    }
    return options;
  };

  public render() {
    const { groupBy, isDisabled, onFilterAdded, onFilterRemoved, orgReport, query, tagReport } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        orgReport={orgReport}
        query={query}
        style={styles.toolbarContainer}
        showFilter
        tagReport={tagReport}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerFilterOwnProps, ExplorerFilterStateProps>((state, props) => {
  // Omitting key_only to share a single request -- the toolbar needs key values
  const queryString = getQuery({
    // key_only: true
  });
  const orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, queryString);
  const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgReportPathsType, orgReportType, queryString);
  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);
  return {
    queryString,
    orgReport,
    orgReportFetchStatus,
    tagReport,
    tagReportFetchStatus,
  };
});

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilter = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase));

export { ExplorerFilter, ExplorerFilterProps };
