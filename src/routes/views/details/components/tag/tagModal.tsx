import { Modal } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, tagPrefix } from 'api/queries/query';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';

import { TagContent } from './tagContent';

interface TagModalOwnProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  tagReportPathsType: TagPathsType;
}

interface TagModalStateProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface TagModalDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagModalProps = TagModalOwnProps & TagModalStateProps & TagModalDispatchProps & WrappedComponentProps;

const tagReportType = TagType.tag;

class TagModalBase extends React.Component<TagModalProps> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchTag, tagReportPathsType, tagQueryString } = this.props;
    fetchTag(tagReportPathsType, tagReportType, tagQueryString);
  }

  public componentDidUpdate(prevProps: TagModalProps) {
    const { fetchTag, tagReportPathsType, tagQueryString } = this.props;
    if (prevProps.tagQueryString !== tagQueryString) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  }

  public shouldComponentUpdate(nextProps: TagModalProps) {
    const { groupByValue, isOpen } = this.props;
    return nextProps.groupByValue !== groupByValue || nextProps.isOpen !== isOpen;
  }

  private getTagValueCount = () => {
    const { tagReport } = this.props;
    let count = 0;

    if (tagReport) {
      for (const item of tagReport.data) {
        if (item.values) {
          count += item.values.length;
        }
      }
    }
    return count;
  };

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, query, tagReport, intl } = this.props;

    // Match page header description
    const groupByValue = query && query.filter && query.filter.account ? query.filter.account : this.props.groupByValue;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.tagHeadingTitle, { value: this.getTagValueCount() })}
        width={'50%'}
      >
        <TagContent groupBy={groupBy} groupByValue={groupByValue} tagReport={tagReport} />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagModalOwnProps, TagModalStateProps>((state, { tagReportPathsType }) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

  // Prune unsupported tag params from filter_by
  const filterByParams = queryFromRoute && queryFromRoute.filter_by ? queryFromRoute.filter_by : {};
  for (const key of Object.keys(filterByParams)) {
    if (key.indexOf(tagPrefix) !== -1) {
      filterByParams[key] = undefined;
    }
  }

  const query: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...filterByParams,
      ...(queryFromRoute &&
        queryFromRoute.filter &&
        queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      ...(groupBy && groupBy.indexOf(tagPrefix) === -1 && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
    },
  };

  const tagQueryString = getQuery(query);
  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
    state,
    tagReportPathsType,
    tagReportType,
    tagQueryString
  );

  return {
    groupBy,
    groupByValue,
    query,
    tagReport,
    tagReportFetchStatus,
    tagQueryString,
  };
});

const mapDispatchToProps: TagModalDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagModal = injectIntl(connect(mapStateToProps, mapDispatchToProps)(TagModalBase));

export { TagModal };
