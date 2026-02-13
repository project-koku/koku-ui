import type { ToolbarLabelGroup } from '@patternfly/react-core';
import { ToolbarFilter, ToolbarItem } from '@patternfly/react-core';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep, uniq, uniqBy } from 'lodash';
import React from 'react';
import { TagValue } from 'routes/components/dataToolbar/tagValue';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectTypeaheadWrapper } from 'routes/components/selectWrapper';
import { orgUnitIdKey, tagKey, tagPrefix } from 'utils/props';

import type { Filters } from './common';
import { getChips, getFilter, hasFilters } from './common';

export const getTagKeySelect = ({
  currentCategory,
  currentTagKey,
  filters,
  isDisabled,
  onTagKeyClear,
  onTagKeySelect,
  tagReport,
}: {
  currentCategory?: string;
  currentTagKey?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onTagKeyClear?: () => void;
  onTagKeySelect?: (event, selection: SelectWrapperOption) => void;
  tagReport?: Tag;
}) => {
  if (currentCategory !== tagKey) {
    return null;
  }

  const selectOptions = getTagKeyOptions(tagReport, undefined, true) as SelectWrapperOption[];

  return (
    <ToolbarItem>
      <SelectTypeaheadWrapper
        aria-label={intl.formatMessage(messages.filterByTagKeyAriaLabel)}
        id="tag-value-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onClear={onTagKeyClear}
        onSelect={onTagKeySelect}
        options={selectOptions}
        placeholder={intl.formatMessage(messages.chooseKeyPlaceholder)}
        selection={currentTagKey}
      />
    </ToolbarItem>
  );
};

// Ensure tag keys are available for given date range
//
// Note: It's possible the user applied a tag filter which is no longer available in a new date range.
// For example, when switching the date range between current and previous months. Tags may only be available in the
// current month and vice versa.
//
// The problem is that we obtain a list of tag keys from the tag report, in order to show the user's filters
// via PatternFly filter chips. If the user's filter is no longer available in the tag report, then the associated
// filter chip will not be shown and the user cannot clear that filter.
//
// As a workaround, we can use active filters (i.e., obtained from query params) to discover any missing tag keys. Then,
// we can create a complete list of tag keys by combining previously applied filters with keys from the tag report.
export const getTagKeyOptions = (
  tagReport: Tag,
  filters: Filters,
  isSelectWrapperOption = false
): ToolbarLabelGroup[] | SelectWrapperOption[] => {
  const options = [];
  const reportOptions = getTagKeyOptionsFromReport(tagReport, isSelectWrapperOption);
  const filterOptions = getTagKeyOptionsFromFilters(filters, isSelectWrapperOption);

  const isTagKeyEqual = (a, b) => {
    if (isSelectWrapperOption) {
      return a.value === b.value;
    } else {
      return a.name === b.name;
    }
  };

  for (const reportoption of reportOptions) {
    if (!options.find(option => isTagKeyEqual(option, reportoption))) {
      options.push(reportoption);
    }
  }
  for (const filterOption of filterOptions) {
    if (!options.find(option => isTagKeyEqual(option, filterOption))) {
      options.push(filterOption);
    }
  }
  return options;
};

const getTagKeyOptionsFromFilters = (
  filter: Filters,
  isSelectWrapperOption = false
): ToolbarLabelGroup[] | SelectWrapperOption[] => {
  const options = [];

  if (!filter?.tag) {
    return options;
  }

  for (const key of Object.keys(filter.tag)) {
    options.push(
      isSelectWrapperOption
        ? {
            toString: () => key, // Tag keys not localized
            value: key,
          }
        : {
            key,
            name: key, // Tag keys not localized
          }
    );
  }
  return options;
};

const getTagKeyOptionsFromReport = (
  tagReport: Tag,
  isSelectWrapperOption = false
): ToolbarLabelGroup[] | SelectWrapperOption[] => {
  let options = [];

  if (!tagReport?.data) {
    return options;
  }

  // If the key_only param is used, we have an array of strings
  let hasTagKeys = false;
  for (const item of tagReport.data) {
    if (item.hasOwnProperty('key')) {
      hasTagKeys = true;
      break;
    }
  }

  // Workaround for https://github.com/project-koku/koku/issues/1797
  let data = uniq(tagReport.data);
  if (hasTagKeys) {
    const keepData = tagReport.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ type, ...keepProps }: any) => keepProps
    );
    data = uniqBy(keepData, 'key');
  }

  if (data.length > 0) {
    options = data.map(item => {
      const key = hasTagKeys ? item.key : item;
      return isSelectWrapperOption
        ? {
            toString: () => key, // Tag keys not localized
            value: key,
          }
        : {
            key,
            name: key, // Tag keys not localized
          };
    });
  }
  return options;
};

// Tag value select

export const getTagValueSelect = ({
  currentCategory,
  currentTagKey,
  endDate,
  filters,
  isDisabled,
  onDelete,
  onTagValueSelect,
  onTagValueInput,
  onTagValueInputChange,
  startDate,
  tagKeyValueInput,
  tagKeyOption,
  tagPathsType,
  timeScopeValue,
}: {
  currentCategory?: string;
  currentTagKey?: string;
  endDate?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onTagValueSelect?: (event: any, selection) => void;
  onTagValueInput?: (event: any) => void;
  onTagValueInputChange?: (value: string) => void;
  startDate?: string;
  tagKeyValueInput?: string;
  tagKeyOption?: ToolbarLabelGroup;
  tagPathsType?: TagPathsType;
  timeScopeValue?: number;
}) => {
  // Todo: categoryName workaround for https://issues.redhat.com/browse/COST-2094
  const categoryName = {
    name: tagKeyOption.name,
    key: `${tagPrefix}${tagKeyOption.key}`,
  };

  return (
    <ToolbarFilter
      categoryName={categoryName}
      labels={getChips(filters?.tag?.[tagKeyOption.key])}
      deleteLabel={onDelete}
      key={tagKeyOption.key}
      showToolbarItem={currentCategory === tagKey && currentTagKey === tagKeyOption.key}
    >
      <TagValue
        endDate={endDate}
        isDisabled={isDisabled && !hasFilters(filters)}
        onTagValueSelect={onTagValueSelect}
        onTagValueInput={onTagValueInput}
        onTagValueInputChange={onTagValueInputChange}
        selections={filters?.tag?.[tagKeyOption.key]?.map(filter => filter.value)}
        startDate={startDate}
        tagKey={currentTagKey}
        tagKeyValue={tagKeyValueInput}
        tagPathsType={tagPathsType}
        timeScopeValue={timeScopeValue}
      />
    </ToolbarFilter>
  );
};

export const onTagValueInput = ({
  currentCriteria,
  currentFilters,
  currentTagKey,
  event,
  tagKeyValueInput,
}: {
  currentCriteria?: string;
  currentFilters?: Filters;
  currentTagKey?: string;
  event?: any;
  tagKeyValueInput?: string;
}) => {
  if ((event.key && event.key !== 'Enter') || tagKeyValueInput.trim() === '') {
    return {};
  }

  const filter = getFilter(`${tagPrefix}${currentTagKey}`, tagKeyValueInput, currentCriteria);
  const newFilters: any = cloneDeep(currentFilters[orgUnitIdKey] ? currentFilters[orgUnitIdKey] : []);

  for (const item of newFilters) {
    if (item.value === tagKeyValueInput) {
      return {
        filter,
        filters: {
          ...currentFilters,
        },
      };
    }
  }
  return {
    filter,
    filters: {
      ...currentFilters,
      tag: {
        ...currentFilters.tag,
        [currentTagKey]: [...newFilters, filter],
      },
    },
  };
};

export const onTagValueSelect = ({
  currentCriteria,
  currentFilters,
  currentTagKey,
  event,
  selection,
}: {
  currentCriteria?: string;
  currentFilters?: Filters;
  currentTagKey?: string;
  event?: any;
  selection: SelectWrapperOption;
}) => {
  const checked = event.target.checked;
  let filter;
  if (checked) {
    filter = getFilter(`${tagPrefix}${currentTagKey}`, selection.value, currentCriteria);
  } else if (currentFilters.tag[currentTagKey]) {
    filter = currentFilters.tag[currentTagKey].find(item => item.value === selection.value);
  }

  const newFilters: any = cloneDeep(currentFilters.tag[currentTagKey] ? currentFilters.tag[currentTagKey] : []);

  return {
    filter,
    filters: {
      ...currentFilters,
      tag: {
        ...currentFilters.tag,
        [currentTagKey]: checked ? [...newFilters, filter] : newFilters.filter(item => item.value !== filter.value),
      },
    },
  };
};
