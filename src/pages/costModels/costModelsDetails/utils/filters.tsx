import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupText,
  TextInput,
  Toolbar,
  ToolbarFilter,
  ToolbarFilterProps,
  ToolbarProps,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons/search-icon';
import HookIntoProps from 'hook-into-props';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
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

const FilterInput: React.SFC<FilterInputProps> = ({ placeholder = '', value, onChange, onKeyPress }) => {
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

const descriptionMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const descriptionMergeProps = (
  stateProps: ReturnType<typeof descriptionMapStateToProps>,
  dispatchProps,
  ownProps: WithTranslation & RouteComponentProps & Inputer
) => {
  const {
    t,
    value,
    setValue,
    history: { push },
  } = ownProps;
  const { filterType, query } = stateProps;
  const children =
    filterType === 'description' ? (
      <FilterInput
        placeholder={t('page_cost_models.filter_by_description')}
        value={value}
        onChange={(text: string) => setValue(text)}
        onKeyPress={onKeyPress(push, 'description', { ...initialCostModelsQuery, ...query }, { value, setValue })}
      />
    ) : null;
  const chips = query.description ? query.description.split(',') : [];
  return {
    deleteChip: onDeleteChip(push, 'description', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(push, { ...initialCostModelsQuery, ...query }, 'description'),
    chips,
    categoryName: t('description'),
    children,
  } as ToolbarFilterProps;
};

const DescriptionFilterConnect = connect(descriptionMapStateToProps, undefined, descriptionMergeProps)(ToolbarFilter);
export const DescriptionFilter = HookIntoProps(() => {
  const [value, setValue] = React.useState('');
  return { value, setValue };
})(withRouter(withTranslation()(DescriptionFilterConnect)));

const nameFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const nameFilterMergeProps = (
  stateProps: ReturnType<typeof nameFilterMapStateToProps>,
  dispatchProps,
  ownProps: Inputer & WithTranslation & RouteComponentProps
) => {
  const {
    t,
    setValue,
    value,
    history: { push },
  } = ownProps;
  const { filterType, query } = stateProps;
  const children =
    filterType === 'name' ? (
      <FilterInput
        placeholder={t('page_cost_models.filter_by_name')}
        value={value}
        onChange={(text: string) => setValue(text)}
        onKeyPress={onKeyPress(push, 'name', { ...initialCostModelsQuery, ...query }, { value, setValue })}
      />
    ) : null;
  const chips = query.name ? query.name.split(',') : [];
  return {
    deleteChip: onDeleteChip(push, 'name', { ...initialCostModelsQuery, ...query }),
    deleteChipGroup: onDeleteChipGroup(push, { ...initialCostModelsQuery, ...query }, 'name'),
    chips,
    categoryName: t('name'),
    children,
  } as ToolbarFilterProps;
};

const NameFilterConnect = connect(nameFilterMapStateToProps, undefined, nameFilterMergeProps)(ToolbarFilter);
export const NameFilter = HookIntoProps(() => {
  const [value, setValue] = React.useState('');
  return { value, setValue };
})(withRouter(withTranslation()(NameFilterConnect)));

export const onSelect = (id: string, setToggle: Opener['setIsOpen']) => {
  return () => {
    setToggle(false);
    const element = document.getElementById(id);
    element && element.focus();
  };
};

const sourceTypeFilterMapStateToProps = (state: RootState) => {
  const filterType = costModelsSelectors.currentFilterType(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { filterType, query };
};

const sourceTypeFilterMergeProps = (
  stateProps: ReturnType<typeof sourceTypeFilterMapStateToProps>,
  _dispatchProps,
  ownProps: Opener & WithTranslation & RouteComponentProps
) => {
  const id = 'source-type-filter';
  const {
    t,
    isOpen,
    setIsOpen,
    history: { push },
  } = ownProps;
  const { filterType, query } = stateProps;
  const onFilter = (source: string) =>
    push(stringifySearch({ ...initialCostModelsQuery, ...query, source_type: source }));
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
            {t('page_cost_models.filter_by_source_type')}
          </DropdownToggle>
        }
        dropdownItems={[
          <DropdownItem key="aws" component="button" onClick={() => onFilter('aws')}>
            {t('page_cost_models.aws')}
          </DropdownItem>,
          <DropdownItem key="azure" component="button" onClick={() => onFilter('azure')}>
            {t('page_cost_models.azure')}
          </DropdownItem>,
          <DropdownItem key="ocp" component="button" onClick={() => onFilter('ocp')}>
            {t('page_cost_models.ocp')}
          </DropdownItem>,
        ]}
      />
    ) : null;
  const chips = query.source_type ? [query.source_type] : [];
  return {
    deleteChip: onDeleteChipGroup(push, { ...initialCostModelsQuery, ...query }, 'source_type'),
    chips,
    categoryName: t('page_cost_models.source_type'),
    children,
  } as ToolbarFilterProps;
};

const SourceFilterConnect = connect(
  sourceTypeFilterMapStateToProps,
  undefined,
  sourceTypeFilterMergeProps
)(ToolbarFilter);
export const SourceTypeFilter = HookIntoProps(() => {
  const [isOpen, setIsOpen] = React.useState(false);
  return { isOpen, setIsOpen };
})(withRouter(withTranslation()(SourceFilterConnect)));

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
