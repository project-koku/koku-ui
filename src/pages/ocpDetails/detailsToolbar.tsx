import {
  Button,
  ButtonVariant,
  Chip,
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
import { OcpQuery } from 'api/ocpQuery';
import { OcpReport } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { isEqual } from 'utils/equal';
import { styles } from './detailsToolbar.styles';
import { FilterBy } from './filterBy';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  exportText: string;
  groupBy: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  report?: OcpReport;
  resultsTotal: number;
}

type DetailsToolbarProps = DetailsToolbarOwnProps & InjectedTranslateProps;

const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  public state = {
    activeFilters: [],
    currentFilterType: this.props.groupBy,
    currentValue: '',
    currentViewType: 'list',
    filterCategory: undefined,
    report: undefined,
  };

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { groupBy, query, report } = this.props;
    if (report && !isEqual(report, prevProps.report)) {
      this.addQuery(query);
    }
    if (groupBy !== prevProps.groupBy) {
      this.setState({
        currentFilterType: groupBy,
      });
    }
  }

  public addQuery = (query: OcpQuery) => {
    const activeFilters = [];
    if (query.filter_by) {
      Object.keys(query.filter_by).forEach(key => {
        if (Array.isArray(query.filter_by[key])) {
          query.filter_by[key].forEach(value => {
            const field = key;
            const filter = this.getFilter(field, value);
            activeFilters.push(filter);
          });
        } else {
          const field = key;
          const filter = this.getFilter(field, query.filter_by[key]);
          activeFilters.push(filter);
        }
      });
    }
    this.setState({ activeFilters });
  };

  public clearFilters = (event: React.FormEvent<HTMLButtonElement>) => {
    this.setState({ activeFilters: [] });
    this.props.onFilterRemoved(this.props.groupBy, '');
    event.preventDefault();
  };

  // Note: Active filters are set upon page refresh -- don't need to do that here
  public filterAdded = (field, value) => {
    const { currentFilterType } = this.state;
    this.props.onFilterAdded(currentFilterType, value);
  };

  public getFilter = (field, value) => {
    const filterLabel = this.getFilterLabel(field, value);
    const result = {
      field,
      label: filterLabel,
      value,
    };
    return result;
  };

  public getFilterLabel = (field, value) => {
    let filterText = '';
    if (field.title) {
      filterText = field.title;
    } else {
      filterText = field;
    }

    const index = filterText.indexOf(tagKey);
    if (index === 0) {
      filterText = 'Tag: ' + filterText.slice(tagKey.length) + ': ';
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

  public selectFilterType = (filterType: string) => {
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
    const { t } = this.props;
    const { currentFilterType, currentValue } = this.state;
    if (!currentFilterType) {
      return null;
    }
    const index = currentFilterType ? currentFilterType.indexOf(tagKey) : -1;
    const placeholder =
      index === 0
        ? t('ocp_cloud_details.filter.tag_placeholder')
        : t(`ocp_cloud_details.filter.${currentFilterType}_placeholder`);

    return (
      <TextInput
        id="filter"
        onChange={this.updateCurrentValue}
        onKeyPress={this.onValueKeyPress}
        placeholder={placeholder}
        value={currentValue}
      />
    );
  }

  public render() {
    const { isExportDisabled, groupBy, pagination, t } = this.props;
    const { activeFilters } = this.state;

    return (
      <div className={css(styles.toolbarContainer)}>
        <Toolbar>
          <ToolbarSection
            aria-label={t('ocp_details.toolbar.filter_aria_label')}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <FilterBy
                  groupBy={groupBy}
                  onItemClicked={this.selectFilterType}
                />
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
