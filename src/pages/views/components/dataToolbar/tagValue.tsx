import { SelectOption, ToolbarChipGroup } from '@patternfly/react-core';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { PerspectiveType } from 'pages/views/explorer/explorerUtils';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';

interface TagValueOwnProps extends WrappedComponentProps {
  endDate?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  perspective?: PerspectiveType;
  startDate?: string;
  tagKey: string;
  tagQueryString?: string;
  tagReportPathsType: TagPathsType;
}

interface TagValueStateProps {
  groupBy: string;
  groupByValue: string | number;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagValueDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface TagValueState {
  // TBD...
}

type TagValueProps = TagValueOwnProps & TagValueStateProps & TagValueDispatchProps;

const tagReportType = TagType.tag;

class TagValueBase extends React.Component<TagValueProps> {
  protected defaultState: TagValueState = {
    // TBD...
  };
  public state: TagValueState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchTag, tagQueryString, tagReportPathsType } = this.props;

    fetchTag(tagReportPathsType, tagReportType, tagQueryString);
  }

  public componentDidUpdate(prevProps: TagValueProps) {
    const { fetchTag, groupBy, perspective, tagQueryString, tagReportPathsType } = this.props;

    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  }

  private getTagValueOptions(): ToolbarChipGroup[] {
    const { tagKey, tagReport } = this.props;

    let data = [];
    if (tagReport && tagReport.data) {
      data = [...new Set([...tagReport.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (tagKey === tag.key && tag.values) {
          options = tag.values.map(val => {
            return {
              key: val,
              name: val, // tag key values not localized
            };
          });
          break;
        }
      }
    }
    return options;
  }

  public render() {
    const selectOptions = this.getTagValueOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    if (selectOptions) {
      return null;
    }
    return null;
  }
}

const mapStateToProps = createMapStateToProps<TagValueOwnProps, TagValueStateProps>(
  (state, { endDate, startDate, tagKey, tagReportPathsType }) => {
    const query = parseQuery<Query>(location.search);
    const groupByOrgValue = getGroupByOrgValue(query);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

    const tagKeyFilter = tagKey
      ? {
          key: tagKey,
        }
      : {};

    const tagQueryParams =
      endDate && startDate
        ? {
            start_date: startDate,
            end_date: endDate,
            ...tagKeyFilter,
          }
        : {
            filter: {
              resolution: 'monthly',
              time_scope_units: 'month',
              time_scope_value: -1,
              ...tagKeyFilter,
            },
          };

    const tagQuery = {
      ...tagQueryParams,
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
        ...(groupBy && { [groupBy]: groupByValue }), // Note: Cannot use group_by with tags
      },
    };

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      ...tagQuery,
    });
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
      tagQueryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: TagValueDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagValueConnect = connect(mapStateToProps, mapDispatchToProps)(TagValueBase);
const TagValue = injectIntl(TagValueConnect);

export { TagValue, TagValueProps };
