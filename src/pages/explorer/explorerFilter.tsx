import { ToolbarChipGroup } from '@patternfly/react-core';
import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagKey } from 'api/queries/query';
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
import {
  getGroupByOptions,
  getOrgReportPathsType,
  getPerspectiveDefault,
  getTagReportPathsType,
  PerspectiveType,
} from './explorerUtils';

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
  orgReportPathsType?: OrgPathsType;
  perspective: PerspectiveType;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagReportPathsType?: TagPathsType;
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

const orgReportType = OrgType.org;
const tagReportType = TagType.tag;

export class ExplorerFilterBase extends React.Component<ExplorerFilterProps> {
  protected defaultState: ExplorerFilterState = {};
  public state: ExplorerFilterState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchOrg, fetchTag, orgReportPathsType, queryString, tagReportPathsType } = this.props;

    if (orgReportPathsType) {
      fetchOrg(orgReportPathsType, orgReportType, queryString);
    }
    if (tagReportPathsType) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  public componentDidUpdate(prevProps: ExplorerFilterProps) {
    const {
      fetchOrg,
      fetchTag,
      orgReport,
      orgReportPathsType,
      query,
      queryString,
      tagReport,
      tagReportPathsType,
    } = this.props;

    if (query && !isEqual(query, prevProps.query)) {
      if (orgReportPathsType) {
        fetchOrg(orgReportPathsType, orgReportType, queryString);
      }
      if (tagReportPathsType) {
        fetchTag(tagReportPathsType, tagReportType, queryString);
      }
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { orgReport, perspective, t, tagReport } = this.props;

    const options = [];
    const groupByOptions = getGroupByOptions(perspective);
    groupByOptions.map(option => {
      options.push({
        name: t(`filter_by.values.${option.label}`),
        key: option.value,
      });
    });
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
  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute);

  // Omitting key_only to share a single request -- the toolbar needs key values
  const queryString = getQuery({
    // key_only: true
  });

  let orgReport;
  let orgReportFetchStatus;
  const orgReportPathsType = getOrgReportPathsType(perspective);
  if (orgReportPathsType) {
    orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, queryString);
    orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgReportPathsType, orgReportType, queryString);
  }

  let tagReport;
  let tagReportFetchStatus;
  const tagReportPathsType = getTagReportPathsType(perspective);
  if (tagReportPathsType) {
    tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
    tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);
  }

  return {
    orgReport,
    orgReportFetchStatus,
    orgReportPathsType,
    perspective,
    queryString,
    tagReport,
    tagReportFetchStatus,
    tagReportPathsType,
  };
});

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilter = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase));

export { ExplorerFilter, ExplorerFilterProps };
