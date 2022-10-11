import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupText,
  TextInput,
  Toolbar,
  ToolbarFilter,
  ToolbarProps,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from 'store';
import { costModelsSelectors } from 'store/costModels';

import { CostModelsQuery, initialCostModelsQuery, stringifySearch } from './query';
import { HistoryPush, Inputer, Opener } from './types';

interface FilterInputProps {
  value: string;
  onChange: (value: string, event: React.FormEvent<HTMLInputElement>) => void;
  onKeyPress: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ placeholder = '', value, onChange, onKeyPress }) => {
  return (
    <InputGroup>
      <TextInput
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={(evt: React.KeyboardEvent<HTMLInputElement>) => {
          if (evt.key !== 'Enter' || value === '') {
            return;
          }
          onKeyPress(evt);
        }}
      />
      <InputGroupText style={{ borderLeft: '0' }}>
        <SearchIcon />
      </InputGroupText>
    </InputGroup>
  );
};

export const onKeyPress =
  (push: HistoryPush, key: string, query: CostModelsQuery, inputer: Inputer) =>
  (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputer.value !== '') {
      const currentValue = inputer.value;
      push(
        stringifySearch({
          ...query,
          [key]: query[key] ? `${query[key]},${currentValue}` : currentValue,
        })
      );
      inputer.setValue('');
    }
  };

export const onDeleteChip = (push: HistoryPush, key, query: CostModelsQuery) => {
  return (_filterName: string, chipName: string) => {
    const newState = query[key] ? query[key].split(',').filter(qval => qval !== chipName) : null;
    push(
      stringifySearch({
        ...query,
        [key]: newState === null || newState.length === 0 ? null : (newState.join(',') as string),
      })
    );
  };
};

export const onDeleteChipGroup = (push: HistoryPush, query: CostModelsQuery, key: string) => {
  return () => {
    push(stringifySearch({ ...query, [key]: null }));
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

type DescriptionFilterProps = DescriptionFilterOwnProps & WrappedComponentProps & RouteComponentProps;

const descriptionMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const descriptionMergeProps = (
  stateProps: ReturnType<typeof descriptionMapStateToProps>,
  dispatchProps,
  ownProps: WrappedComponentProps & RouteComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    history,
  } = ownProps;
  const { filterType, query } = stateProps;

  const chips = query.description ? query.description.split(',') : [];
  return {
    categoryName: intl.formatMessage(messages.description),
    chips,
    deleteChip: onDeleteChip(history.push, 'description', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(history.push, { ...initialCostModelsQuery, ...query }, 'description'),
    filterType,
    history,
    intl,
    query,
  };
};

const DescriptionFilterBase: React.FC<DescriptionFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  history,
  intl,
  chips,
  categoryName,
  query,
}) => {
  const [value, setValue] = React.useState('');
  const children =
    filterType === 'description' ? (
      <FilterInput
        placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: filterType })}
        value={value}
        onChange={(text: string) => setValue(text)}
        onKeyPress={onKeyPress(
          history.push,
          'description',
          { ...initialCostModelsQuery, ...query },
          { value, setValue }
        )}
      />
    ) : null;
  return (
    <ToolbarFilter deleteChip={deleteChip} deleteChipGroup={deleteChipGroup} chips={chips} categoryName={categoryName}>
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

type NameFilterProps = NameFilterOwnProps & WrappedComponentProps & RouteComponentProps;

const nameFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const nameFilterMergeProps = (
  stateProps: ReturnType<typeof nameFilterMapStateToProps>,
  dispatchProps,
  ownProps: WrappedComponentProps & RouteComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    history,
  } = ownProps;

  const { filterType, query } = stateProps;
  const chips = query.name ? query.name.split(',') : [];

  return {
    deleteChip: onDeleteChip(history.push, 'name', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(history.push, { ...initialCostModelsQuery, ...query }, 'name'),
    filterType,
    chips,
    categoryName: intl.formatMessage(messages.names, { count: 1 }),
    history,
    intl,
    query,
  };
};

const NameFilterBase: React.FC<NameFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  history,
  intl,
  chips,
  categoryName,
  query,
}) => {
  const [value, setValue] = React.useState('');
  const children =
    filterType === 'name' ? (
      <FilterInput
        placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: filterType })}
        value={value}
        onChange={(text: string) => setValue(text)}
        onKeyPress={onKeyPress(history.push, 'name', { ...initialCostModelsQuery, ...query }, { value, setValue })}
      />
    ) : null;
  return (
    <ToolbarFilter deleteChip={deleteChip} deleteChipGroup={deleteChipGroup} chips={chips} categoryName={categoryName}>
      {children}
    </ToolbarFilter>
  );
};
const NameFilterConnect = connect(nameFilterMapStateToProps, undefined, nameFilterMergeProps)(NameFilterBase);
export const NameFilter = injectIntl(withRouter(NameFilterConnect));

export const onSelect = (id: string, setToggle: Opener['setIsOpen']) => {
  return () => {
    setToggle(false);
    const element = document.getElementById(id);
    element && element.focus();
  };
};

interface SourceTypeFilterOwnProps {
  deleteChip?: any;
  deleteChipGroup?: any;
  filterType?: any;
  chips?: any;
  categoryName?: string;
  query?: any;
}

type SourceTypeFilterProps = SourceTypeFilterOwnProps & WrappedComponentProps & RouteComponentProps;

const sourceTypeFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const sourceTypeFilterMergeProps = (
  stateProps: ReturnType<typeof sourceTypeFilterMapStateToProps>,
  _dispatchProps,
  ownProps: WrappedComponentProps & RouteComponentProps
) => {
  const {
    intl = defaultIntl, // Default required for testing
    history,
  } = ownProps;
  const { filterType, query } = stateProps;

  const chips = query.source_type ? [query.source_type] : [];
  return {
    chips,
    categoryName: intl.formatMessage(messages.costModelsSourceType),
    deleteChip: onDeleteChipGroup(history.push, { ...initialCostModelsQuery, ...query }, 'source_type'),
    filterType,
    history,
    intl,
    query,
  };
};

const SourceTypeFilterBase: React.FC<SourceTypeFilterProps> = ({
  deleteChip,
  deleteChipGroup,
  filterType,
  history,
  intl,
  chips,
  categoryName,
  query,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = 'source-type-filter';
  const onFilter = (source: string) =>
    history.push(stringifySearch({ ...initialCostModelsQuery, ...query, source_type: source }));
  const children =
    filterType === 'sourceType' ? (
      <Dropdown
        onSelect={onSelect(id, setIsOpen)}
        isOpen={isOpen}
        toggle={
          <DropdownToggle
            onToggle={(value: boolean) => {
              setIsOpen(value);
            }}
            id={id}
          >
            {intl.formatMessage(messages.filterByPlaceholder, { value: 'source_type' })}
          </DropdownToggle>
        }
        dropdownItems={[
          <DropdownItem key="aws" component="button" onClick={() => onFilter('aws')}>
            {intl.formatMessage(messages.aws)}
          </DropdownItem>,
          <DropdownItem key="azure" component="button" onClick={() => onFilter('azure')}>
            {intl.formatMessage(messages.azure)}
          </DropdownItem>,
          <DropdownItem key="ocp" component="button" onClick={() => onFilter('ocp')}>
            {intl.formatMessage(messages.openShift)}
          </DropdownItem>,
        ]}
      />
    ) : null;
  return (
    <ToolbarFilter deleteChip={deleteChip} deleteChipGroup={deleteChipGroup} chips={chips} categoryName={categoryName}>
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
  ownProps: RouteComponentProps & { children: React.ReactNode }
) => {
  const {
    history: { push },
  } = ownProps;
  const { query } = stateProps;
  return {
    id: 'cost-models-toolbar',
    clearAllFilters: () =>
      push(stringifySearch({ ...initialCostModelsQuery, ...query, description: null, source_type: null, name: null })),
    children: ownProps.children,
  } as ToolbarProps;
};

export const ClearableToolbar = withRouter(connect(toolbarMapStateToProps, undefined, toolbarMergeProps)(Toolbar));
