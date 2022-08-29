import { TagIcon } from '@patternfly/react-icons/dist/esm/icons/tag-icon';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query, tagPrefix } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { getTestProps, testIds } from 'testIds';

import { styles } from './tag.styles';
import { TagModal } from './tagModal';

interface TagLinkOwnProps {
  id?: string;
  tagReportPathsType: TagPathsType;
}

interface TagLinkState {
  isOpen: boolean;
}

interface TagLinkStateProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
  queryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagLinkDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagLinkProps = TagLinkOwnProps & TagLinkStateProps & TagLinkDispatchProps & WrappedComponentProps;

const tagReportType = TagType.tag;

class TagLinkBase extends React.Component<TagLinkProps> {
  protected defaultState: TagLinkState = {
    isOpen: false,
  };
  public state: TagLinkState = { ...this.defaultState };

  constructor(props: TagLinkProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    fetchTag(tagReportPathsType, tagReportType, queryString);
  }

  public componentDidUpdate(prevProps: TagLinkProps) {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { id, tagReport, tagReportPathsType } = this.props;
    const { isOpen } = this.state;

    let count = 0;

    if (tagReport) {
      for (const item of tagReport.data) {
        if (item.values) {
          count += item.values.length;
        }
      }
    }

    return (
      <div style={styles.tagsContainer} id={id}>
        {Boolean(count > 0) && (
          <>
            <TagIcon />
            <a {...getTestProps(testIds.details.tag_lnk)} href="#/" onClick={this.handleOpen} style={styles.tagLink}>
              {count}
            </a>
          </>
        )}
        <TagModal isOpen={isOpen} onClose={this.handleClose} tagReportPathsType={tagReportPathsType} />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagLinkOwnProps, TagLinkStateProps>((state, { tagReportPathsType }) => {
  const query = parseQuery<Query>(location.search);
  const groupByOrgValue = getGroupByOrgValue(query);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

  // Prune unsupported tag params from filter_by
  const filterByParams = query && query.filter_by ? query.filter_by : {};
  for (const key of Object.keys(filterByParams)) {
    if (key.indexOf(tagPrefix) !== -1) {
      filterByParams[key] = undefined;
    }
  }

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...filterByParams,
      ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
      ...(groupBy && groupBy.indexOf(tagPrefix) === -1 && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
    },
  };
  const queryString = getQuery(newQuery);

  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);

  return {
    groupBy,
    groupByValue,
    query,
    queryString,
    tagReport,
    tagReportFetchStatus,
  };
});

const mapDispatchToProps: TagLinkDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagLink = injectIntl(connect(mapStateToProps, mapDispatchToProps)(TagLinkBase));

export { TagLink, TagLinkProps };
