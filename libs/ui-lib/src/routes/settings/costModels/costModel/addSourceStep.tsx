import type { CostModel } from '@koku-ui/api/costModels';
import type { Provider } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Checkbox, Pagination, Toolbar, ToolbarContent, ToolbarItem, Tooltip } from '@patternfly/react-core';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { sourcesActions, sourcesSelectors } from '../../../../store/sourceSettings';
import { EmptyFilterState } from '../../../components/state/emptyFilterState';
import { LoadingState } from '../../../components/state/loadingState';
import { getOperatorStatus } from '../../../utils/operatorStatus';
import { SourcesModalErrorState } from '../components/errorState';
import { addMultiValueQuery, removeMultiValueQuery } from '../components/filterLogic';
import { AssignSourcesToolbar } from './assignSourcesModalToolbar';
import { styles } from './costModelInfo.styles';
import { getSourceType } from './utils/sourceType';

interface AddSourcesStepOwnProps extends WrappedComponentProps {
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
  fetchingSourcesError: string;
  isLoadingSources: boolean;
  providers: Provider[];
  pagination: { page: number; perPage: number; count: number };
  query: { name: string; type: string; offset: string; limit: string };
  setState: (newState: { [uuid: string]: { selected: boolean; meta: Provider } }) => void;
}

interface AddSourcesStepStateProps {
  currentFilter: {
    name: string;
    value: string;
  };
  filter: string;
}

interface AddSourcesStepDispatchProps {
  updateFilter: typeof sourcesActions.updateFilterToolbar;
}

interface AddSourcesStepState {
  // TBD...
}

type AddSourcesStepProps = AddSourcesStepOwnProps & AddSourcesStepStateProps & AddSourcesStepDispatchProps;

class AddSourcesStepBase extends React.Component<AddSourcesStepProps, AddSourcesStepState> {
  public render() {
    const { costModel, intl } = this.props;

    if (this.props.isLoadingSources) {
      return <LoadingState />;
    }
    if (this.props.fetchingSourcesError) {
      return <SourcesModalErrorState />;
    }

    const onSelect = (isSelected, rowId) => {
      if (rowId === -1) {
        const pageSelections = this.props.providers.reduce((acc, cur) => {
          // If assigned to another cost model, maintain original selection
          const isAssigned =
            cur.cost_models.length && cur.cost_models.find(cm => cm.name === costModel.name) === undefined;
          const selected = this.props.checked[cur.uuid] ? this.props.checked[cur.uuid].selected : false;
          return {
            ...acc,
            [cur.uuid]: { selected: isAssigned ? selected : isSelected, meta: cur, isAssigned },
          };
        }, {});
        const newState = {
          ...this.props.checked,
          ...pageSelections,
        };
        this.props.setState(
          newState as {
            [uuid: string]: { selected: boolean; meta: Provider };
          }
        );
        return;
      }
      this.props.setState({
        ...this.props.checked,
        [this.props.providers[rowId].uuid]: {
          selected: isSelected,
          meta: this.props.providers[rowId],
        },
      });
    };

    const source_type = getSourceType(costModel.source_type) ?? '';

    const sources = this.props.providers.map(providerData => {
      const isSelected = this.props.checked[providerData.uuid] ? this.props.checked[providerData.uuid].selected : false;
      const provCostModels =
        providerData.cost_models === undefined
          ? intl.formatMessage(messages.costModelsWizardSourceTableDefaultCostModel)
          : providerData.cost_models.map(cm => cm.name).join(',');
      const isAssigned =
        providerData.cost_models.length &&
        providerData.cost_models.find(cm => cm.name === costModel.name) === undefined;
      const cellName = <div key={providerData.uuid}>{providerData.name}</div>;

      const cells = [cellName, provCostModels || ''];
      if (source_type === 'OCP') {
        cells.splice(1, 0, getOperatorStatus(providerData.additional_context?.operator_update_available));
      }

      return {
        isAssigned,
        cells,
        selected: isSelected,
      };
    });

    return (
      <>
        <AssignSourcesToolbar
          filter={{
            onClearAll: () => this.props.fetch(`source_type=${source_type}&limit=${this.props.pagination.perPage}`),
            onRemove: (category, chip) => {
              const newQuery = removeMultiValueQuery({
                name: this.props.query.name ? this.props.query.name.split(',') : [],
              })(category, chip);
              this.props.fetch(
                `source_type=${source_type}${newQuery.name ? `&name=${newQuery.name.join(',')}` : ''}&offset=0&limit=${this.props.pagination.perPage}`
              );
            },
            query: {
              name: this.props.query.name ? this.props.query.name.split(',') : [],
            },
          }}
          filterInputProps={{
            id: 'assign-sources-modal-toolbar-input',
            onChange: (value: string) =>
              this.props.updateFilter({
                currentFilterType: 'name',
                currentFilterValue: value,
              }),
            value: this.props.currentFilter.value,
            onSearch: () => {
              const curQuery = this.props.query.name ? this.props.query.name.split(',') : [];
              const newQuery = addMultiValueQuery({ name: curQuery })('name', this.props.currentFilter.value);
              this.props.fetch(
                `source_type=${source_type}&name=${newQuery.name.join(',')}&limit=${
                  this.props.pagination.perPage
                }&offset=0`
              );
            },
          }}
          paginationProps={{
            isCompact: true,
            itemCount: this.props.pagination.count,
            perPage: this.props.pagination.perPage,
            page: this.props.pagination.page,
            onPerPageSelect: (_evt, newPerPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${newPerPage}&offset=0&${
                  this.props.query.name ? `name=${this.props.query.name}` : ''
                }`
              );
            },
            onSetPage: (_evt, newPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${this.props.pagination.perPage}&offset=${
                  this.props.pagination.perPage * (newPage - 1)
                }&${this.props.query.name ? `name=${this.props.query.name}` : ''}`
              );
            },
          }}
        />
        {sources.length > 0 && (
          <Table
            aria-label={intl.formatMessage(messages.costModelsAssignSources, { count: 1 })}
            variant={TableVariant.compact}
          >
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_evt, isSelecting) => onSelect(isSelecting, -1),
                    isSelected: sources.filter(s => s.isAssigned || s.selected).length === sources.length,
                  }}
                ></Th>
                <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
                {source_type === 'OCP' && <Th>{intl.formatMessage(messages.operatorVersion)}</Th>}
                <Th>{intl.formatMessage(messages.costModelsWizardSourceTableCostModel)}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sources.map((s, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {s.isAssigned ? (
                      <Tooltip
                        content={intl.formatMessage(messages.costModelsWizardSourceWarning, {
                          costModel: s.cells[2],
                        })}
                      >
                        <Checkbox
                          id={`checkbox-${rowIndex}`}
                          key={`checkbox-${rowIndex}`}
                          aria-label={intl.formatMessage(messages.selectRow, { value: rowIndex })}
                          isDisabled
                        />
                      </Tooltip>
                    ) : (
                      <Checkbox
                        onChange={(_evt, isChecked) => {
                          onSelect(isChecked, rowIndex);
                        }}
                        id={`checkbox-${rowIndex}`}
                        key={`checkbox-${rowIndex}`}
                        aria-label={intl.formatMessage(messages.selectRow, { value: rowIndex })}
                        isChecked={s.selected}
                      />
                    )}
                  </Td>
                  {s.cells.map((c, cellIndex) => (
                    <Td key={cellIndex}>{c}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {sources.length === 0 && (
          <EmptyFilterState filter={this.props.filter} subTitle={messages.emptyFilterSourceStateSubtitle} />
        )}
        <Toolbar id="costmodels-details-sources-pagination-datatoolbar">
          <ToolbarContent style={{ flexDirection: 'row-reverse' }}>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={this.props.pagination.count}
                isDisabled={this.props.isLoadingSources}
                perPage={this.props.pagination.perPage}
                page={this.props.pagination.page}
                style={styles.pagination}
                titles={{
                  paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                    title: intl.formatMessage(messages.costModelsAssignSourcesParen),
                    placement: 'bottom',
                  }),
                }}
                onPerPageSelect={(_evt, newPerPage) => {
                  this.props.fetch(
                    `limit=${newPerPage}&offset=0&${this.props.query.name ? `name=${this.props.query.name}` : ''}`
                  );
                }}
                onSetPage={(_evt, newPage) => {
                  this.props.fetch(
                    `limit=${this.props.pagination.perPage}&offset=${this.props.pagination.perPage * (newPage - 1)}&${
                      this.props.query.name ? `name=${this.props.query.name}` : ''
                    }`
                  );
                }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<AddSourcesStepOwnProps, AddSourcesStepStateProps>(state => {
  return {
    currentFilter: {
      name: sourcesSelectors.currentFilterType(state),
      value: sourcesSelectors.currentFilterValue(state),
    },
    filter: sourcesSelectors.filter(state),
  };
});

const mapDispatchToProps: AddSourcesStepDispatchProps = {
  updateFilter: sourcesActions.updateFilterToolbar,
};

const AddSourcesStep = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddSourcesStepBase));

export default AddSourcesStep;
