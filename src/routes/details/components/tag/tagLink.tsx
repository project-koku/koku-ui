import { TagIcon } from '@patternfly/react-icons/dist/esm/icons/tag-icon';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery, parseQueryState } from 'api/queries/query';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/utils/groupBy';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { logicalAndPrefix, orgUnitIdKey, platformCategoryKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './tag.styles';
import { TagModal } from './tagModal';

interface TagLinkOwnProps extends RouterComponentProps, WrappedComponentProps {
  id?: string;
  tagPathsType: TagPathsType;
}

interface TagLinkState {
  isOpen: boolean;
}

interface TagLinkStateProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface TagLinkDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagLinkProps = TagLinkOwnProps & TagLinkStateProps & TagLinkDispatchProps;

const tagType = TagType.tag;

class TagLinkBase extends React.Component<TagLinkProps, TagLinkState> {
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
    const { fetchTag, tagPathsType, tagQueryString } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  }

  public componentDidUpdate(prevProps: TagLinkProps) {
    const { fetchTag, tagPathsType, tagQueryString } = this.props;
    if (prevProps.tagQueryString !== tagQueryString) {
      fetchTag(tagPathsType, tagType, tagQueryString);
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
    const { id, tagReport, tagPathsType } = this.props;
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
        {count > 0 && (
          <>
            <TagIcon />
            <a data-testid="tag-lnk" href="#/" onClick={this.handleOpen} style={styles.tagLink}>
              {count}
            </a>
          </>
        )}
        <TagModal isOpen={isOpen} onClose={this.handleClose} tagPathsType={tagPathsType} />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagLinkOwnProps, TagLinkStateProps>((state, { router, tagPathsType }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = parseQueryState<Query>(queryFromRoute);

  const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

  // Prune unsupported tag params from filter_by
  const filterByParams = queryState && queryState.filter_by ? queryState.filter_by : {};
  for (const key of Object.keys(filterByParams)) {
    // Omit unsupported query params
    if (
      key.indexOf('node') !== -1 ||
      key.indexOf('region') !== -1 ||
      key.indexOf('service') !== -1 ||
      key.indexOf(tagPrefix) !== -1
    ) {
      filterByParams[key] = undefined;
    }
  }

  const query = { ...queryFromRoute };
  const tagQuery = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...filterByParams,
      ...(queryFromRoute && queryFromRoute.isPlatformCosts && { category: platformCategoryKey }),
      ...(queryFromRoute &&
        queryFromRoute.filter &&
        queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(groupBy && groupByValue !== '*' && groupBy.indexOf(tagPrefix) === -1 && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
    },
  };

  const tagQueryString = getQuery(tagQuery);
  const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

  return {
    groupBy,
    groupByValue,
    query,
    tagReport,
    tagReportFetchStatus,
    tagQueryString,
  };
});

const mapDispatchToProps: TagLinkDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagLink = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagLinkBase)));

export default TagLink;
