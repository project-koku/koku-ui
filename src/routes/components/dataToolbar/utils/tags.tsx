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

  const selectOptions = getTagKeyOptions(tagReport, true) as SelectWrapperOption[];

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

export const getTagKeyOptions = (
  tagReport: Tag,
  isSelectWrapperOption = false
): ToolbarLabelGroup[] | SelectWrapperOption[] => {
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
  tagKeyOption,
  tagPathsType,
  tagKeyValueInput,
}: {
  currentCategory?: string;
  currentTagKey?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onTagValueSelect?: (event: any, selection) => void;
  onTagValueInput?: (event: any) => void;
  onTagValueInputChange?: (value: string) => void;
  tagKeyOption?: ToolbarLabelGroup;
  tagPathsType?: TagPathsType;
  tagKeyValueInput?: string;
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
