import type { ToolbarChipGroup } from '@patternfly/react-core';
import { Button, ButtonVariant, InputGroup, InputGroupItem, TextInput } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/utils/groupBy';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { orgUnitIdKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface TagValueOwnProps extends RouterComponentProps, WrappedComponentProps {
  isDisabled?: boolean;
  onTagValueSelect(event, selection);
  onTagValueInput(event);
  onTagValueInputChange(value: string);
  selections?: SelectOptionObject[];
  tagKey: string;
  tagKeyValue: string;
  tagPathsType: TagPathsType;
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
  isTagValueExpanded?: boolean;
  tagKeyValueInput?: string;
}

type TagValueProps = TagValueOwnProps & TagValueStateProps & TagValueDispatchProps;

const tagType = TagType.tag;

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const tagKeyValueLimit = 50;

class TagValueBase extends React.Component<TagValueProps, TagValueState> {
  protected defaultState: TagValueState = {
    isTagValueExpanded: false,
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

  private onTagValueChange = (value: string) => {
    const { onTagValueInputChange } = this.props;

    this.setState({ tagKeyValueInput: value }, () => {
      if (onTagValueInputChange) {
        onTagValueInputChange(value);
      }
    });
  };

  private onTagValueToggle = isOpen => {
    this.setState({
      isTagValueExpanded: isOpen,
    });
  };

  private updateReport = () => {
    const { fetchTag, tagQueryString, tagPathsType } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  };

  public render() {
    const { intl, isDisabled, onTagValueInput, onTagValueSelect, selections, tagKeyValue } = this.props;
    const { isTagValueExpanded } = this.state;

    const selectOptions = this.getTagValueOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    if (selectOptions.length > 0 && selectOptions.length < tagKeyValueLimit) {
      return (
        <Select
          isDisabled={isDisabled}
          variant={SelectVariant.checkbox}
          aria-label={intl.formatMessage(messages.filterByTagValueAriaLabel)}
          onSelect={onTagValueSelect}
          onToggle={(_evt, isExpanded) => this.onTagValueToggle(isExpanded)}
          selections={selections}
          isOpen={isTagValueExpanded}
          placeholderText={intl.formatMessage(messages.chooseValuePlaceholder)}
        >
          {selectOptions}
        </Select>
      );
    }
    return (
      <InputGroup>
        <InputGroupItem isFill>
          <TextInput
            isDisabled={isDisabled}
            name="tag-key-value-input"
            id="tag-key-value-input"
            type="search"
            aria-label={intl.formatMessage(messages.filterByTagValueAriaLabel)}
            onChange={(_evt, value) => this.onTagValueChange(value)}
            value={tagKeyValue}
            placeholder={intl.formatMessage(messages.filterByValuePlaceholder)}
            onKeyDown={evt => onTagValueInput(evt)}
          />
        </InputGroupItem>
        <InputGroupItem>
          <Button
            isDisabled={isDisabled}
            variant={ButtonVariant.control}
            aria-label={intl.formatMessage(messages.filterByTagValueButtonAriaLabel)}
            onClick={evt => onTagValueInput(evt)}
          >
            <SearchIcon />
          </Button>
        </InputGroupItem>
      </InputGroup>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagValueOwnProps, TagValueStateProps>(
  (state, { router, tagKey, tagPathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      filter: {
        key: tagKey,
      },
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
