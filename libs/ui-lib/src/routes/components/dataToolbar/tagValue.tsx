import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Tag, TagPathsType } from '@koku-ui/api/tags/tag';
import { TagType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import { SearchInput } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../store/common';
import { createMapStateToProps } from '../../../store/common';
import { tagActions, tagSelectors } from '../../../store/tags';
import { orgUnitIdKey } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../utils/groupBy';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectCheckboxWrapper } from '../selectWrapper';

interface TagValueOwnProps extends RouterComponentProps, WrappedComponentProps {
  endDate?: string;
  isDisabled?: boolean;
  onTagValueSelect(event, selection);
  onTagValueInput(event);
  onTagValueInputChange(value: string);
  selections?: SelectWrapperOption[];
  startDate?: string;
  tagKey: string;
  tagKeyValue: string;
  tagPathsType: TagPathsType;
  timeScopeValue?: number;
}

interface TagValueStateProps {
  groupBy?: string;
  groupByValue?: string | number;
  tagQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagValueDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface TagValueState {
  tagKeyValueInput?: string;
}

type TagValueProps = TagValueOwnProps & TagValueStateProps & TagValueDispatchProps;

const tagType = TagType.tag;

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const tagKeyValueLimit = 50;

class TagValueBase extends React.Component<TagValueProps, TagValueState> {
  protected defaultState: TagValueState = {
    // TBD...
  };
  public state: TagValueState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: TagValueProps) {
    const { tagQueryString, tagPathsType } = this.props;

    if (prevProps.tagQueryString !== tagQueryString || prevProps.tagPathsType !== tagPathsType) {
      this.updateReport();
    }
  }

  // Ensure tag key values are available for given date range
  private getSelections() {
    const { selections, tagKey, tagReport } = this.props;

    const result = [];
    if (!selections?.length) {
      return result;
    }

    const tagKeyItem = tagReport?.data?.find(item => item.key === tagKey);
    selections?.map(selection => {
      if (tagKeyItem?.values?.length) {
        for (const item of tagKeyItem.values) {
          if (item === selection) {
            result.push(selection);
            break;
          }
        }
      }
    });
    return result;
  }

  private getTagValueOptions(): SelectWrapperOption[] {
    const { tagKey, tagReport } = this.props;

    let data = [];
    if (tagReport?.data) {
      data = [...new Set([...tagReport.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (tagKey === tag.key && tag.values) {
          options = tag.values.map(val => {
            return {
              toString: () => val, // Tag key values not localized
              value: val,
            };
          });
          break;
        }
      }
    }
    return options;
  }

  private onTagValueChange = (value: string) => {
    const { onTagValueInputChange } = this.props;

    this.setState({ tagKeyValueInput: value }, () => {
      if (onTagValueInputChange) {
        onTagValueInputChange(value);
      }
    });
  };

  private updateReport = () => {
    const { fetchTag, tagQueryString, tagPathsType } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  };

  public render() {
    const { intl, isDisabled, onTagValueInput, onTagValueSelect, tagKeyValue } = this.props;

    const selectOptions = this.getTagValueOptions();

    if (selectOptions.length > 0 && selectOptions.length < tagKeyValueLimit) {
      return (
        <SelectCheckboxWrapper
          aria-label={intl.formatMessage(messages.filterByTagValueAriaLabel)}
          id="tag-value-select"
          isDisabled={isDisabled}
          onSelect={onTagValueSelect}
          options={selectOptions}
          placeholder={intl.formatMessage(messages.chooseValuePlaceholder)}
          selections={this.getSelections()}
        />
      );
    }
    return (
      <SearchInput
        aria-label={intl.formatMessage(messages.filterByTagValueAriaLabel)}
        id="tag-key-value-input"
        isDisabled={isDisabled}
        onChange={(_evt, value) => this.onTagValueChange(value)}
        onClear={() => this.onTagValueChange('')}
        onSearch={evt => onTagValueInput(evt)}
        placeholder={intl.formatMessage(messages.filterByValuePlaceholder)}
        value={tagKeyValue}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<TagValueOwnProps, TagValueStateProps>(
  (state, { endDate, router, startDate, tagKey, tagPathsType, timeScopeValue = -1 }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      ...(startDate && endDate
        ? {
            end_date: endDate,
            filter: {
              key: tagKey,
            },
            start_date: startDate,
          }
        : {
            filter: {
              key: tagKey,
              time_scope_value: timeScopeValue,
            },
          }),
    });

    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

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
const TagValue = injectIntl(withRouter(TagValueConnect));

export { TagValue };
