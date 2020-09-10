import {
  Button,
  ButtonProps,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationProps,
  Select,
  SelectOption,
  SelectOptionProps,
  SelectVariant,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons/search-icon';
import {
  addMultiValueQuery,
  addSingleValueQuery,
  removeMultiValueQuery,
  removeSingleValueQuery,
} from 'pages/costModels/components/filterLogic';
import { ReadOnlyTooltip } from 'pages/costModels/costModelsDetails/components/readOnlyTooltip';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Omit } from 'react-redux';

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string, event: React.FormEvent<HTMLInputElement>) => void;
  onSearch: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.SFC<SearchInputProps> = ({
  id,
  placeholder = '',
  value,
  onChange,
  onSearch,
}) => {
  return (
    <InputGroup>
      <TextInput
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={onChange}
        onKeyPress={(evt: React.KeyboardEvent<HTMLInputElement>) => {
          if (evt.key !== 'Enter' || value === '') {
            return;
          }
          onSearch(evt);
        }}
      />
      <InputGroupText style={{ borderLeft: '0' }}>
        <SearchIcon />
      </InputGroupText>
    </InputGroup>
  );
};

interface SelectFilterProps {
  onSelect: (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    value: string
  ) => void;
  onToggle: (isExpanded: boolean) => void;
  selected: string;
  isExpanded: boolean;
  options: SelectOptionProps[];
}

const SingleSelectFilter: React.SFC<SelectFilterProps> = ({
  options,
  onSelect,
  onToggle,
  selected,
  isExpanded,
}) => {
  return (
    <Select
      isOpen={isExpanded}
      toggleIcon={<FilterIcon />}
      variant={SelectVariant.single}
      onSelect={onSelect}
      onToggle={onToggle}
      selections={selected}
    >
      {options.map(optionProps => (
        <SelectOption key={`${optionProps.value}`} {...optionProps} />
      ))}
    </Select>
  );
};

type PrimaryFilterBaseProps = InjectedTranslateProps &
  Omit<SelectFilterProps, 'options'>;

interface CostModelsDetailsToolberBaseProps extends InjectedTranslateProps {
  buttonProps: ButtonProps;
  primaryProps: Omit<PrimaryFilterBaseProps, 't'>;
  paginationProps: PaginationProps;
  secondaries: {
    name: string;
    deleteChip?: () => void;
    render: () => React.ReactNode;
  }[];
  onClearAll: () => void;
  onRemove: (category: string, chip: string) => void;
  chips: { [k: string]: string | string[] };
}

const CostModelsDetailsToolberBase: React.SFC<CostModelsDetailsToolberBaseProps> = ({
  t,
  chips,
  buttonProps,
  primaryProps,
  paginationProps,
  secondaries,
  onClearAll,
  onRemove,
}) => {
  return (
    <Toolbar id="costmodels-details-datatoolbar" clearAllFilters={onClearAll}>
      <ToolbarContent>
        <ToolbarGroup variant={'filter-group'}>
          <ToolbarItem>
            <SingleSelectFilter
              onSelect={primaryProps.onSelect}
              onToggle={primaryProps.onToggle}
              selected={primaryProps.selected}
              isExpanded={primaryProps.isExpanded}
              options={[
                {
                  value: 'name',
                  children: t('toolbar.sources.primary.name'),
                  key: 'name',
                },
                {
                  value: 'source_type',
                  children: t('toolbar.sources.primary.source_type'),
                  key: 'source_type',
                },
                {
                  value: 'description',
                  children: t('toolbar.sources.primary.description'),
                  key: 'description',
                },
              ]}
            />
          </ToolbarItem>
          {secondaries.map(secondary => {
            return (
              <ToolbarItem key={secondary.name}>
                <ToolbarFilter
                  deleteChip={onRemove}
                  chips={chips[secondary.name] as any}
                  categoryName={t(`toolbar.sources.primary.${secondary.name}`)}
                >
                  {primaryProps.selected === secondary.name &&
                    secondary.render()}
                </ToolbarFilter>
              </ToolbarItem>
            );
          })}
        </ToolbarGroup>
        <ToolbarItem>
          <ReadOnlyTooltip isDisabled={buttonProps.isDisabled}>
            <Button {...buttonProps} />
          </ReadOnlyTooltip>
        </ToolbarItem>
        <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
          <Pagination
            isCompact={paginationProps.isCompact}
            itemCount={paginationProps.itemCount}
            perPage={paginationProps.perPage}
            page={paginationProps.page}
            onSetPage={paginationProps.onSetPage}
            onPerPageSelect={paginationProps.onPerPageSelect}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

interface CostModelsDetailsToolbarStatefulProps extends InjectedTranslateProps {
  paginationProps: PaginationProps;
  buttonProps: ButtonProps;
  onSearch: (searchQuery: { [k: string]: string }) => void;
  query: {
    name?: string;
    description?: string;
    source_type?: string;
  };
}

interface CostModelsDetailsToolbarStatefulState {
  primaryExpanded: boolean;
  primarySelected: string;
  secondaryExpanded: boolean;
  secondaryValue: string;
}

class CostModelsDetailsToolbarStateful extends React.Component<
  CostModelsDetailsToolbarStatefulProps,
  CostModelsDetailsToolbarStatefulState
> {
  public state = {
    primaryExpanded: false,
    primarySelected: 'name',
    secondaryExpanded: false,
    secondaryValue: '',
  };
  public render() {
    const { t, paginationProps, buttonProps, onSearch, query } = this.props;
    const {
      primaryExpanded,
      primarySelected,
      secondaryValue,
      secondaryExpanded,
    } = this.state;
    return (
      <CostModelsDetailsToolberBase
        onRemove={(category: string, chip: string) => {
          let newQuery;
          if (category === t('toolbar.sources.primary.name')) {
            newQuery = removeMultiValueQuery(query)('name', chip);
          }
          if (category === t('toolbar.sources.primary.description')) {
            newQuery = removeMultiValueQuery(query)('description', chip);
          }
          if (category === t('toolbar.sources.primary.source_type')) {
            newQuery = removeSingleValueQuery(query)('source_type');
          }
          return onSearch(newQuery);
        }}
        onClearAll={() =>
          onSearch({ name: null, description: null, source_type: null })
        }
        chips={{
          name: query.name || [],
          source_type: query.source_type ? [query.source_type] : [],
          description: query.description || [],
        }}
        buttonProps={buttonProps}
        paginationProps={paginationProps}
        primaryProps={{
          isExpanded: primaryExpanded,
          onSelect: (_evt, value) => {
            this.setState({
              primaryExpanded: false,
              primarySelected: value,
              secondaryValue: '',
            });
          },
          onToggle: isExpanded =>
            this.setState({ primaryExpanded: isExpanded }),
          selected: primarySelected,
        }}
        secondaries={[
          {
            name: 'name',
            render: () => {
              return (
                <SearchInput
                  id="cost-model-details-toolbar-name-search"
                  value={secondaryValue}
                  onChange={(value: string) => {
                    this.setState({
                      secondaryValue: value,
                    });
                  }}
                  onSearch={() => {
                    const newQuery = addMultiValueQuery(query)(
                      primarySelected,
                      secondaryValue
                    );
                    this.setState(
                      {
                        secondaryValue: '',
                      },
                      () => onSearch(newQuery)
                    );
                  }}
                  placeholder={t('toolbar.filterby', {
                    name: t('toolbar.sources.lower.name'),
                  })}
                />
              );
            },
          },
          {
            name: 'description',
            render: () => {
              return (
                <SearchInput
                  id="cost-model-details-toolbar-description-search"
                  value={secondaryValue}
                  onChange={(value: string) => {
                    this.setState({
                      secondaryValue: value,
                    });
                  }}
                  onSearch={() => {
                    const newQuery = addMultiValueQuery(query)(
                      primarySelected,
                      secondaryValue
                    );
                    this.setState(
                      {
                        secondaryValue: '',
                      },
                      () => onSearch(newQuery)
                    );
                  }}
                  placeholder={t('toolbar.filterby', {
                    name: t('toolbar.sources.lower.description'),
                  })}
                />
              );
            },
          },
          {
            name: 'source_type',
            render: () => {
              return (
                <SingleSelectFilter
                  onSelect={(_evt, value: string) => {
                    const newQuery = addSingleValueQuery(query)(
                      primarySelected,
                      value
                    );
                    this.setState(
                      {
                        secondaryValue: value,
                        secondaryExpanded: false,
                      },
                      () => onSearch(newQuery)
                    );
                  }}
                  onToggle={isExpanded => {
                    this.setState({
                      secondaryExpanded: isExpanded,
                    });
                  }}
                  selected={secondaryValue}
                  isExpanded={secondaryExpanded}
                  options={[
                    {
                      value: 'none',
                      children: t('toolbar.sources.secondary.none'),
                      key: 'none',
                      isPlaceholder: true,
                      isDisabled: true,
                    },
                    {
                      value: 'AWS',
                      children: t('toolbar.sources.secondary.aws'),
                      key: 'aws',
                    },
                    {
                      value: 'OCP',
                      children: t('toolbar.sources.secondary.ocp'),
                      key: 'ocp',
                    },
                    {
                      value: 'AZURE',
                      children: t('toolbar.sources.secondary.azure'),
                      key: 'azure',
                    },
                  ]}
                />
              );
            },
          },
        ]}
        t={t}
      />
    );
  }
}

export const CostModelDetailsToolbar = translate()(
  CostModelsDetailsToolbarStateful
);
