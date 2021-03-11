import { Modal } from '@patternfly/react-core';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';

import { TagView } from './tagView';

interface TagModalOwnProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  tagReportPathsType: TagPathsType;
}

interface TagModalStateProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
  queryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagModalDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagModalProps = TagModalOwnProps & TagModalStateProps & TagModalDispatchProps & WithTranslation;

const tagReportType = TagType.tag;

class TagModalBase extends React.Component<TagModalProps> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    fetchTag(tagReportPathsType, tagReportType, queryString);
  }

  public componentDidUpdate(prevProps: TagModalProps) {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
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
    const { groupBy, isOpen, query, tagReport, t } = this.props;

    // Match page header description
    const groupByValue = query && query.filter && query.filter.account ? query.filter.account : this.props.groupByValue;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('tag.title', {
          value: this.getTagValueCount(),
        })}
        width={'50%'}
      >
        <TagView groupBy={groupBy} groupByValue={groupByValue} tagReport={tagReport} />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagModalOwnProps, TagModalStateProps>((state, { tagReportPathsType }) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const query = queryFromRoute;
  const groupByOrgValue = getGroupByOrgValue(query);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(groupBy && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
      ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
      ...(query && query.filter_by && query.filter_by),
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

const mapDispatchToProps: TagModalDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagModal = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TagModalBase));

export { TagModal };
