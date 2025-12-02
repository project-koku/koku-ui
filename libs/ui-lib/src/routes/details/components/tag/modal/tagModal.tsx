import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Tag, TagData, TagPathsType } from '@koku-ui/api/tags/tag';
import { TagType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import { Modal, ModalBody, ModalHeader } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../../../store/common';
import { createMapStateToProps } from '../../../../../store/common';
import { tagActions, tagSelectors } from '../../../../../store/tags';
import { logicalAndPrefix, orgUnitIdKey, platformCategoryKey, tagPrefix } from '../../../../../utils/props';
import type { RouterComponentProps } from '../../../../../utils/router';
import { withRouter } from '../../../../../utils/router';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../../utils/groupBy';
import { getQueryState } from '../../../../utils/queryState';
import { getTimeScopeValue } from '../../../../utils/timeScope';
import { TagContent } from './tagContent';

interface TagModalOwnProps extends RouterComponentProps, WrappedComponentProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  tagData?: TagData[];
  tagPathsType: TagPathsType;
  virtualMachine?: string;
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
    const { groupBy, intl, isOpen, query, tagData, tagReport, virtualMachine } = this.props;

    // Match page header description
    const groupByValue = query && query.filter && query.filter.account ? query.filter.account : this.props.groupByValue;

    return (
      <Modal className="costManagement" isOpen={isOpen} onClose={this.handleClose} width={'50%'}>
        <ModalHeader title={intl.formatMessage(messages.tagHeadingTitle, { value: this.getTagValueCount() })} />
        <ModalBody>
          <TagContent
            groupBy={groupBy}
            groupByValue={this.props.isPlatformCosts ? platformCategoryKey : groupByValue}
            tagData={tagData}
            tagReport={tagReport}
            virtualMachine={virtualMachine}
          />
        </ModalBody>
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
