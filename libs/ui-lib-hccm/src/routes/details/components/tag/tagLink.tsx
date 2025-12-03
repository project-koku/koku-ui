import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Tag, TagData, TagPathsType } from '@koku-ui/api/tags/tag';
import { TagType } from '@koku-ui/api/tags/tag';
import { TagIcon } from '@patternfly/react-icons/dist/esm/icons/tag-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../../store/common';
import { createMapStateToProps } from '../../../../store/common';
import { tagActions, tagSelectors } from '../../../../store/tags';
import { logicalAndPrefix, orgUnitIdKey, platformCategoryKey, tagPrefix } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../utils/groupBy';
import { getQueryState } from '../../../utils/queryState';
import { getTimeScopeValue } from '../../../utils/timeScope';
import { TagModal } from './modal/tagModal';
import { styles } from './tag.styles';

interface TagLinkOwnProps extends RouterComponentProps, WrappedComponentProps {
  id?: string;
  tagData?: TagData[];
  tagPathsType: TagPathsType;
  virtualMachine?: string;
}

interface TagLinkState {
  isOpen: boolean;
}

interface TagLinkStateProps {
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
    if (tagPathsType) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  }

  public componentDidUpdate(prevProps: TagLinkProps) {
    const { fetchTag, tagPathsType, tagQueryString } = this.props;
    if (prevProps.tagQueryString !== tagQueryString && tagPathsType) {
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
    const { id, tagData, tagReport, tagPathsType, virtualMachine } = this.props;
    const { isOpen } = this.state;

    let count = 0;
    if (tagData || tagReport) {
      const tags = tagData || tagReport.data;
      if (tags instanceof Array) {
        for (const item of tags) {
          if (item.values) {
            count += item.values.length;
          }
        }
      }
    }
    if (count === 0) {
      return null;
    }
    return (
      <div style={styles.tagsContainer} id={id}>
        <TagIcon />
        <a data-testid="tag-lnk" href="#/" onClick={this.handleOpen} style={styles.tagLink}>
          {count}
        </a>
        <TagModal
          isOpen={isOpen}
          onClose={this.handleClose}
          tagData={tagData}
          tagPathsType={tagPathsType}
          virtualMachine={virtualMachine}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagLinkOwnProps, TagLinkStateProps>((state, { router, tagPathsType }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = getQueryState(router.location, 'details');

  const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
  const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  // Prune unsupported tag params from filter_by, but don't reset queryState
  const filterByParams = {
    ...(queryState?.filter_by ? queryState.filter_by : {}),
  };
  for (const key of Object.keys(filterByParams)) {
    // Omit unsupported query params
    if (
      key.indexOf('node') !== -1 ||
      key.indexOf('region') !== -1 ||
      key.indexOf('resource_location') !== -1 ||
      key.indexOf('service') !== -1 ||
      key.indexOf(tagPrefix) !== -1
    ) {
      filterByParams[key] = undefined;
    }
  }

  const tagQuery = {
    filter: {
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...filterByParams,
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
    },
  };

  const tagQueryString = getQuery(tagQuery);
  const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

  return {
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
