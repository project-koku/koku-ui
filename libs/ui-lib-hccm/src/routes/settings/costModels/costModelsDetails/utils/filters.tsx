import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarProps } from '@patternfly/react-core';
import { SearchInput } from '@patternfly/react-core';
import { Toolbar, ToolbarFilter } from '@patternfly/react-core';
import React, { useState } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { RootState } from '../../../../../store';
import { costModelsSelectors } from '../../../../../store/costModels';
import type { RouterComponentProps } from '../../../../../utils/router';
import { withRouter } from '../../../../../utils/router';
import type { SelectWrapperOption } from '../../../../components/selectWrapper';
import { SelectWrapper } from '../../../../components/selectWrapper';
import type { CostModelsQuery } from './query';
import { initialCostModelsQuery, stringifySearch } from './query';
import type { Inputer } from './types';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (event, value: string) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ placeholder = '', value, onChange, onSearch }) => {
  return (
    <SearchInput
      aria-label={placeholder}
      id="cost-model-filter-input"
      onChange={(_evt, val) => onChange(val)}
      onClear={() => onChange('')}
      onSearch={onSearch}
      placeholder={placeholder}
      value={value}
    />
  );
};

export const onSearch = (router, key: string, query: CostModelsQuery, inputer: Inputer) => () => {
  if (inputer.value !== '') {
    const currentValue = inputer.value;
    router.navigate(
      stringifySearch({
        ...query,
        [key]: query[key] ? `${query[key]},${currentValue}` : currentValue,
      })
    );
    inputer.setValue('');
  }
};

export const onDeleteChip = (router, key, query: CostModelsQuery) => {
  return (_filterName: string, chipName: string) => {
    const newState = query[key] ? query[key].split(',').filter(qval => qval !== chipName) : null;
    router.navigate(
      stringifySearch({
        ...query,
        [key]: newState === null || newState.length === 0 ? null : (newState.join(',') as string),
      })
    );
  };
};

export const onDeleteChipGroup = (router, query: CostModelsQuery, key: string) => {
  return () => {
    router.navigate(stringifySearch({ ...query, [key]: null }));
  };
};

interface DescriptionFilterOwnProps {
  deleteChip?: any;
  deleteChipGroup?: any;
  filterType?: any;
  chips?: any;
  categoryName?: string;
  query?: any;
}

type DescriptionFilterProps = DescriptionFilterOwnProps & WrappedComponentProps & RouterComponentProps;

const descriptionMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const descriptionMergeProps = (
  stateProps: ReturnType<typeof descriptionMapStateToProps>,
  dispatchProps,
  ownProps: WrappedComponentProps & RouterComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    router,
  } = ownProps;
  const { filterType, query } = stateProps;

  const chips = query.description ? query.description.split(',') : [];
  return {
    categoryName: intl.formatMessage(messages.description),
    chips,
    deleteChip: onDeleteChip(router, 'description', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(router, { ...initialCostModelsQuery, ...query }, 'description'),
    filterType,
    intl,
    query,
    router,
  };
};

const DescriptionFilterBase: React.FC<DescriptionFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  intl,
  chips,
  categoryName,
  query,
  router,
}) => {
  const [value, setValue] = React.useState('');
  const children =
    filterType === 'description' ? (
      <FilterInput
        placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: filterType }) as string}
        value={value}
        onChange={(val: string) => setValue(val)}
        onSearch={onSearch(router, 'description', { ...initialCostModelsQuery, ...query }, { value, setValue })}
      />
    ) : null;
  return (
    <ToolbarFilter
      deleteLabel={deleteChip}
      deleteLabelGroup={deleteChipGroup}
      labels={chips}
      categoryName={categoryName}
    >
      {children}
    </ToolbarFilter>
  );
};
const DescriptionFilterConnect = connect(
  descriptionMapStateToProps,
  undefined,
  descriptionMergeProps
)(DescriptionFilterBase);
export const DescriptionFilter = injectIntl(withRouter(DescriptionFilterConnect));

interface NameFilterOwnProps {
  deleteChip?: any;
  deleteChipGroup?: any;
  filterType?: any;
  chips?: any;
  categoryName?: string;
  query?: any;
}

type NameFilterProps = NameFilterOwnProps & WrappedComponentProps & RouterComponentProps;

const nameFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const nameFilterMergeProps = (
  stateProps: ReturnType<typeof nameFilterMapStateToProps>,
  dispatchProps,
  ownProps: WrappedComponentProps & RouterComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    router,
  } = ownProps;

  const { filterType, query } = stateProps;
  const chips = query.name ? query.name.split(',') : [];

  return {
    deleteChip: onDeleteChip(router, 'name', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(router, { ...initialCostModelsQuery, ...query }, 'name'),
    filterType,
    chips,
    categoryName: intl.formatMessage(messages.names, { count: 1 }),
    intl,
    query,
    router,
  };
};

const NameFilterBase: React.FC<NameFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  intl,
  chips,
  categoryName,
  query,
  router,
}) => {
  const [value, setValue] = React.useState('');
  const children =
    filterType === 'name' ? (
      <FilterInput
        placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: filterType }) as string}
        value={value}
        onChange={(val: string) => setValue(val)}
        onSearch={onSearch(router, 'name', { ...initialCostModelsQuery, ...query }, { value, setValue })}
      />
    ) : null;
  return (
    <ToolbarFilter
      deleteLabel={deleteChip}
      deleteLabelGroup={deleteChipGroup}
      labels={chips}
      categoryName={categoryName}
    >
      {children}
    </ToolbarFilter>
  );
};
const NameFilterConnect = connect(nameFilterMapStateToProps, undefined, nameFilterMergeProps)(NameFilterBase);
export const NameFilter = injectIntl(withRouter(NameFilterConnect));

interface SourceTypeFilterOwnProps {
  deleteChip?: any;
  deleteChipGroup?: any;
  filterType?: any;
  chips?: any;
  categoryName?: string;
  query?: any;
}

type SourceTypeFilterProps = SourceTypeFilterOwnProps & WrappedComponentProps & RouterComponentProps;

const sourceTypeFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const getSourceTypeMsg = (sourceType: string) => {
  let msg;
  switch (sourceType) {
    case 'aws':
      msg = messages.aws;
      break;
    case 'azure':
      msg = messages.azure;
      break;
    case 'gcp':
      msg = messages.gcp;
      break;
    case 'ocp':
      msg = messages.openShift;
      break;
  }
  return msg;
};

const sourceTypeFilterMergeProps = (
  stateProps: ReturnType<typeof sourceTypeFilterMapStateToProps>,
  _dispatchProps,
  ownProps: WrappedComponentProps & RouterComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    router,
  } = ownProps;
  const { filterType, query } = stateProps;

  const msg = getSourceTypeMsg(query.source_type);
  const chips = query.source_type
    ? [
        {
          key: query.source_type,
          node: msg ? intl.formatMessage(msg) : query.source_type,
        },
      ]
    : [];

  return {
    chips,
    categoryName: intl.formatMessage(messages.sourceType),
    deleteChip: onDeleteChipGroup(router, { ...initialCostModelsQuery, ...query }, 'source_type'),
    filterType,
    intl,
    query,
    router,
  };
};

const SourceTypeFilterBase: React.FC<SourceTypeFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  intl,
  chips,
  categoryName,
  query,
  router,
}) => {
  const [currentItem, setCurrentItem] = useState<string>();

  const handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    setCurrentItem(selection.value);
    router.navigate(stringifySearch({ ...initialCostModelsQuery, ...query, source_type: selection.value }));
  };

  const selectOptions: SelectWrapperOption[] = [
    {
      toString: () => intl.formatMessage(getSourceTypeMsg('aws')),
      value: 'aws',
    },
    {
      toString: () => intl.formatMessage(getSourceTypeMsg('azure')),
      value: 'azure',
    },
    {
      toString: () => intl.formatMessage(getSourceTypeMsg('gcp')),
      value: 'gcp',
    },
    {
      toString: () => intl.formatMessage(getSourceTypeMsg('ocp')),
      value: 'ocp',
    },
  ];
  const selection = selectOptions.find(option => option.value === currentItem);

  const children =
    filterType === 'sourceType' ? (
      <SelectWrapper
        id="source-type-select"
        onSelect={handleOnSelect}
        options={selectOptions}
        placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: 'source_type' })}
        selection={selection}
      />
    ) : null;
  return (
    <ToolbarFilter
      deleteLabel={deleteChip}
      deleteLabelGroup={deleteChipGroup}
      labels={chips}
      categoryName={categoryName}
    >
      {children}
    </ToolbarFilter>
  );
};

const SourceTypeFilterConnect = connect(
  sourceTypeFilterMapStateToProps,
  undefined,
  sourceTypeFilterMergeProps
)(SourceTypeFilterBase);
export const SourceTypeFilter = injectIntl(withRouter(SourceTypeFilterConnect));

const toolbarMapStateToProps = (state: RootState) => {
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { query };
};

const toolbarMergeProps = (
  stateProps: ReturnType<typeof toolbarMapStateToProps>,
  _dispatchProps: unknown,
  ownProps: RouterComponentProps & { children: React.ReactNode }
) => {
  const { children, router } = ownProps;
  const { query } = stateProps;
  return {
    id: 'cost-models-toolbar',
    clearAllFilters: () =>
      router.navigate(
        stringifySearch({ ...initialCostModelsQuery, ...query, description: null, source_type: null, name: null })
      ),
    children,
  } as ToolbarProps;
};

export const ClearableToolbar = withRouter(connect(toolbarMapStateToProps, undefined, toolbarMergeProps)(Toolbar));
