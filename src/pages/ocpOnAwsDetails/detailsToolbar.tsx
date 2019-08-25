import {
  Button,
  ButtonVariant,
  Chip,
  FormSelect,
  FormSelectOption,
  TextInput,
  Title,
  TitleSize,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport } from 'api/ocpOnAwsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { isEqual } from 'utils/equal';
import { styles } from './detailsToolbar.styles';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  filterFields: any[];
  exportText: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  pagination?: React.ReactNode;
  query?: OcpOnAwsQuery;
  report?: OcpOnAwsReport;
  resultsTotal: number;
}

type DetailsToolbarProps = DetailsToolbarOwnProps & InjectedTranslateProps;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  public state = {
    activeFilters: [],
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentViewType: 'list',
    filterCategory: undefined,
    report: undefined,
  };

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { filterFields, query, report } = this.props;
    if (report && !isEqual(report, prevProps.report)) {
      this.addQuery(query);
    }
    if (!isEqual(filterFields, prevProps.filterFields)) {
      this.setState({
        currentFilterType: this.props.filterFields[0],
      });
    }
  }

  public addQuery = (query: OcpOnAwsQuery) => {
    const activeFilters = [];
    Object.keys(query.group_by).forEach(key => {
      if (query.group_by[key] !== '*') {
        if (Array.isArray(query.group_by[key])) {
          query.group_by[key].forEach(value => {
            const field = (key as any).id || key;
            const filter = this.getFilter(field, value);
            activeFilters.push(filter);
          });
        } else {
          const field = (key as any).id || key;
          const filter = this.getFilter(field, query.group_by[key]);
          activeFilters.push(filter);
        }
      }
    });
    this.setState({ activeFilters });
  };

  public clearFilters = (event: React.FormEvent<HTMLButtonElement>) => {
    const { currentFilterType } = this.state;
    this.setState({ activeFilters: [] });
    this.props.onFilterRemoved(currentFilterType.id, '');
    event.preventDefault();
  };

  // Note: Active filters are set upon page refresh -- don't need to do that here
  public filterAdded = (field, value) => {
    const { currentFilterType } = this.state;
    this.props.onFilterAdded(currentFilterType.id, value);
  };

  public getFilter = (field, value) => {
    const { currentFilterType } = this.state;
    const filterLabel = this.getFilterLabel(field, value);
    return {
      field: field.indexOf('tag:') === 0 ? field : currentFilterType.id,
      label: filterLabel,
      value,
    };
  };

  public getFilterLabel = (field, value) => {
    let filterText = '';
    if (field.title) {
      filterText = field.title;
    } else {
      filterText = field;
    }

    const index = filterText.indexOf('tag:');
    if (index === 0) {
      filterText = 'Tag: ' + filterText.slice(4) + ': ';
    } else {
      filterText =
        filterText.charAt(0).toUpperCase() + filterText.slice(1) + ': ';
    }

    if (value.filterCategory) {
      filterText += `${value.filterCategory.title ||
        value.filterCategory}-${value.filterValue.title || value.filterValue}`;
    } else if (value.title) {
      filterText += value.title;
    } else {
      filterText += value;
    }
    return filterText;
  };

  public handleExportClicked = () => {
    this.props.onExportClicked();
  };

  public onValueKeyPress = (e: React.KeyboardEvent) => {
    const { currentValue, currentFilterType } = this.state;
    if (e.key === 'Enter' && currentValue && currentValue.length > 0) {
      this.setState({ currentValue: '' });
      this.filterAdded(currentFilterType, currentValue);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  public removeFilter = filter => {
    const { activeFilters } = this.state;

    const index = activeFilters.indexOf(filter);
    if (index > -1) {
      const updated = [
        ...activeFilters.slice(0, index),
        ...activeFilters.slice(index + 1),
      ];
      this.setState({ activeFilters: updated });
      this.props.onFilterRemoved(filter.field, filter.value);
    }
  };

  public selectFilterType = filterType => {
    const { currentFilterType } = this.state;
    if (currentFilterType !== filterType) {
      this.setState({
        currentValue: '',
        currentFilterType: filterType,
      });
    }
  };

  public updateCurrentValue = (currentValue: string) => {
    this.setState({ currentValue });
  };

  public renderInput() {
    const { currentFilterType, currentValue } = this.state;
    if (!currentFilterType) {
      return null;
    }
    return (
      <TextInput
        id="filter"
        onChange={this.updateCurrentValue}
        onKeyPress={this.onValueKeyPress}
        placeholder={currentFilterType.placeholder}
        value={currentValue}
      />
    );
  }

  public render() {
    const { filterFields, isExportDisabled, pagination, t } = this.props;
    const { activeFilters } = this.state;

    return (
      <div className={css(styles.toolbarContainer)}>
        <Toolbar>
          <ToolbarSection
            aria-label={t('ocp_details.toolbar.filter_aria_label')}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <FormSelect
                  aria-label={t('ocp_details.toolbar.filter_type_aria_label')}
                >
                  {filterFields.map(({ id, label }) => {
                    return (
                      <FormSelectOption
                        key={`filter-type-${id}`}
                        label={label}
                        value={id}
                      />
                    );
                  })}
                </FormSelect>
              </ToolbarItem>
              <ToolbarItem>{this.renderInput()}</ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Button
                  isDisabled={isExportDisabled}
                  onClick={this.handleExportClicked}
                  variant={ButtonVariant.link}
                >
                  <span className={css(styles.export)}>
                    {t('ocp_details.toolbar.export')}
                  </span>
                  <ExternalLinkSquareAltIcon />
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup style={{ marginLeft: 'auto' }}>
              <ToolbarItem>{pagination}</ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
          <ToolbarSection
            aria-label={t('ocp_details.toolbar.filter_results_aria_label')}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <Title size={TitleSize.md} headingLevel="h5">
                  {t('ocp_details.toolbar.results', {
                    value: this.props.resultsTotal,
                  })}
                </Title>
              </ToolbarItem>
            </ToolbarGroup>
            {activeFilters.length > 0 && (
              <React.Fragment>
                <ToolbarGroup>
                  <ToolbarItem>
                    {t('ocp_details.toolbar.active_filters')}
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    {activeFilters.map((item, index) => (
                      <Chip
                        style={{ paddingRight: '20px' }}
                        key={`applied-filter-${index}`}
                        onClick={() => this.removeFilter(item)}
                      >
                        {item.label}
                      </Chip>
                    ))}
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button onClick={this.clearFilters} variant="plain">
                      {t('ocp_details.toolbar.clear_filters')}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </React.Fragment>
            )}
          </ToolbarSection>
        </Toolbar>
      </div>
    );
  }
}

const DetailsToolbar = translate()(DetailsToolbarBase);

export { DetailsToolbar };
