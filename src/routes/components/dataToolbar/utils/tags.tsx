import type { ToolbarChipGroup } from '@patternfly/react-core';
import { ToolbarFilter, ToolbarItem } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
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
import { ExcludeType } from './exclude';

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
// The problem is that we obtain a list of tag keys from the tag report, in order to show the currently applied filters
// using PatternFly filter chips. If an applied filter is not available in the tag report, then the associated
// filter chip will not be shown and users cannot clear that filter.
//
// As a workaround, we can use the filter_by query params to discover any missing tag keys. This represents the
// previously applied filters, which we combine with keys from the tag report.
export const getTagKeyOptions = (
  tagReport: Tag,
  query: Query,
  isSelectWrapperOption = false
): ToolbarChipGroup[] | SelectWrapperOption[] => {
  const options = [];
  const reportOptions = getTagKeyOptionsFromReport(tagReport, isSelectWrapperOption);
  const queryOptions = getTagKeyOptionsFromQuery(query, isSelectWrapperOption);

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
  for (const queryOption of queryOptions) {
    if (!options.find(option => isTagKeyEqual(option, queryOption))) {
      options.push(queryOption);
    }
  }
  return options;
};

const getTagKeyOptionsFromQuery = (
  query: Query,
  isSelectWrapperOption = false
): ToolbarChipGroup[] | SelectWrapperOption[] => {
  const options = [];

  if (!query?.filter_by) {
    return options;
  }

  for (const filter of Object.keys(query.filter_by)) {
    if (filter.indexOf(tagPrefix) !== -1) {
      const key = filter.substring(tagPrefix.length);
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
  }
  return options;
};

const getTagKeyOptionsFromReport = (
  tagReport: Tag,
  isSelectWrapperOption = false
): ToolbarChipGroup[] | SelectWrapperOption[] => {
  let data = [];
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
  if (hasTagKeys) {
    const keepData = tagReport.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ type, ...keepProps }: any) => keepProps
    );
    data = uniqBy(keepData, 'key');
  } else {
    data = uniq(tagReport.data);
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
  filters,
  isDisabled,
  onDelete,
  onTagValueSelect,
  onTagValueInput,
  onTagValueInputChange,
  tagKeyValueInput,
  tagKeyOption,
  tagPathsType,
}: {
  currentCategory?: string;
  currentTagKey?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onTagValueSelect?: (event: any, selection) => void;
  onTagValueInput?: (event: any) => void;
  onTagValueInputChange?: (value: string) => void;
  tagKeyValueInput?: string;
  tagKeyOption?: ToolbarChipGroup;
  tagPathsType?: TagPathsType;
}) => {
  // Todo: categoryName workaround for https://issues.redhat.com/browse/COST-2094
  const categoryName = {
    name: tagKeyOption.name,
    key: `${tagPrefix}${tagKeyOption.key}`,
  };

  return (
    <ToolbarFilter
      categoryName={categoryName}
      chips={getChips(filters?.tag?.[tagKeyOption.key])}
      deleteChip={onDelete}
      key={tagKeyOption.key}
      showToolbarItem={currentCategory === tagKey && currentTagKey === tagKeyOption.key}
    >
      <TagValue
        isDisabled={isDisabled && !hasFilters(filters)}
        onTagValueSelect={onTagValueSelect}
        onTagValueInput={onTagValueInput}
        onTagValueInputChange={onTagValueInputChange}
        selections={filters?.tag?.[tagKeyOption.key] ? filters.tag[tagKeyOption.key].map(filter => filter.value) : []}
        tagKey={currentTagKey}
        tagKeyValue={tagKeyValueInput}
        tagPathsType={tagPathsType}
      />
    </ToolbarFilter>
  );
};

export const onTagValueInput = ({
  currentExclude,
  currentFilters,
  currentTagKey,
  event,
  tagKeyValueInput,
}: {
  currentExclude?: string;
  currentFilters?: Filters;
  currentTagKey?: string;
  event?: any;
  tagKeyValueInput?: string;
}) => {
  if ((event.key && event.key !== 'Enter') || tagKeyValueInput.trim() === '') {
    return {};
  }

  const isExcludes = currentExclude === ExcludeType.exclude;
  const filter = getFilter(`${tagPrefix}${currentTagKey}`, tagKeyValueInput, isExcludes);
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
  currentExclude,
  currentFilters,
  currentTagKey,
  event,
  selection,
}: {
  currentExclude?: string;
  currentFilters?: Filters;
  currentTagKey?: string;
  event?: any;
  selection: SelectWrapperOption;
}) => {
  const checked = event.target.checked;
  let filter;
  if (checked) {
    const isExcludes = currentExclude === ExcludeType.exclude;
    filter = getFilter(`${tagPrefix}${currentTagKey}`, selection.value, isExcludes);
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
