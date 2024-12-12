import { Modal } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Tag, TagData, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/utils/groupBy';
import { getQueryState } from 'routes/utils/queryState';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { logicalAndPrefix, orgUnitIdKey, platformCategoryKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { TagContent } from './tagContent';

interface TagModalOwnProps extends RouterComponentProps, WrappedComponentProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  tagData?: TagData[];
  tagPathsType: TagPathsType;
}

interface TagModalStateProps {
  groupBy: string;
  groupByValue: string | number;
  isPlatformCosts?: boolean;
  query?: Query;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface TagModalDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagModalProps = TagModalOwnProps & TagModalStateProps & TagModalDispatchProps;

const tagType = TagType.tag;

class TagModalBase extends React.Component<TagModalProps, any> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchTag, tagData, tagPathsType, tagQueryString } = this.props;
    if (!tagData) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  }

  public componentDidUpdate(prevProps: TagModalProps) {
    const { fetchTag, tagData, tagPathsType, tagQueryString } = this.props;
    if (prevProps.tagQueryString !== tagQueryString && !tagData) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  }

  public shouldComponentUpdate(nextProps: TagModalProps) {
    const { groupByValue, isOpen } = this.props;
    return nextProps.groupByValue !== groupByValue || nextProps.isOpen !== isOpen;
  }

  private getTagValueCount = () => {
    const { tagData, tagReport } = this.props;
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
    return count;
  };

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, intl, isOpen, query, tagData, tagReport } = this.props;

    // Match page header description
    const groupByValue = query && query.filter && query.filter.account ? query.filter.account : this.props.groupByValue;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.tagHeadingTitle, { value: this.getTagValueCount() })}
        width={'50%'}
      >
        <TagContent
          groupBy={groupBy}
          groupByValue={this.props.isPlatformCosts ? platformCategoryKey : groupByValue}
          tagData={tagData}
          tagReport={tagReport}
        />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagModalOwnProps, TagModalStateProps>(
  (state, { router, tagPathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);
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

    const query = { ...queryFromRoute };
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
        ...(groupBy && groupByValue !== '*' && groupBy.indexOf(tagPrefix) === -1 && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
      },
    };

    const tagQueryString = getQuery(tagQuery);
    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

    return {
      groupBy,
      groupByValue,
      isPlatformCosts: queryFromRoute?.isPlatformCosts,
      query,
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: TagModalDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagModal = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagModalBase)));

export { TagModal };
