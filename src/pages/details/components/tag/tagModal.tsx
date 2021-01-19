import { Modal } from '@patternfly/react-core';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';

import { TagView } from './tagView';

interface TagModalOwnProps {
  filterBy: string | number;
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  tagReportPathsType: TagPathsType;
}

interface TagModalStateProps {
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
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
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
    const { filterBy, groupBy, isOpen, tagReport, t } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('tag.title', {
          value: this.getTagValueCount(),
        })}
        width={'50%'}
      >
        <TagView filterBy={filterBy} groupBy={groupBy} tagReport={tagReport} />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagModalOwnProps, TagModalStateProps>(
  (state, { filterBy, groupBy, tagReportPathsType }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const queryString = getQuery({
      filter: {
        [groupBy]: filterBy,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
        ...(queryFromRoute.filter.account && {
          account: queryFromRoute.filter.account,
        }),
      },
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      queryString
    );
    return {
      queryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: TagModalDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagModal = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TagModalBase));

export { TagModal };
