import {
  Bullseye,
  Button,
  Content,
  EmptyState,
  EmptyStateBody,
  Pagination,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { SortByDirection } from '@patternfly/react-table';
import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import uniqWith from 'lodash/uniqWith';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { SelectCheckboxWrapper, SelectWrapper } from 'routes/components/selectWrapper';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { WithPriceListSearch } from 'routes/settings/costModels/components/hoc/withPriceListSearch';
import { PaginationToolbarTemplate } from 'routes/settings/costModels/components/paginationToolbarTemplate';
import { PriceListToolbar } from 'routes/settings/costModels/components/priceListToolbar';
import { compareBy } from 'routes/settings/costModels/components/rateForm/utils';
import { RateTable } from 'routes/settings/costModels/components/rateTable';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { unitsLookupKey } from 'utils/format';

import { CostModelContext } from './context';

interface PriceListTableProps extends WrappedComponentProps {
  addRateAction: () => void;
  deleteRateAction: (data: any) => void;
  items: any[];
  metricsHash: MetricHash;
}

interface PriceListTableState {
  metrics: string[];
  measurements: string[];
  sortBy: {
    index: number;
    direction: SortByDirection;
  };
}

class PriceListTable extends React.Component<PriceListTableProps, PriceListTableState> {
  protected defaultState: PriceListTableState = {
    metrics: [],
    measurements: [],
    sortBy: {
      index: 0,
      direction: SortByDirection.asc,
    },
  };
  public state: PriceListTableState = { ...this.defaultState };

  public render() {
    const { addRateAction, deleteRateAction, intl, items, metricsHash } = this.props;

    const getMetricLabel = m => {
      // Match message descriptor or default to API string
      const value = m.replace(/ /g, '_').toLowerCase();
      const label = intl.formatMessage(messages.metricValues, { value });
      return label ? label : m;
    };
    const getMeasurementLabel = m => {
      if (!m) {
        return '';
      }
      // Match message descriptor or default to API string
      const label = intl.formatMessage(messages.measurementValues, {
        value: m.toLowerCase().replace('-', '_'),
        count: 1,
      });
      return label ? label : m;
    };
    const metricOpts = Object.keys(metricsHash)
      .map(m => ({
        toString: () => getMetricLabel(m),
        value: m,
      }))
      .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));

    const measurementOpts = uniqWith(
      metricOpts.reduce((acc, curr) => {
        const measures = Object.keys(metricsHash[curr.value]).map(m => ({
          toString: () => getMeasurementLabel(metricsHash[curr.value][m]?.label_measurement),
          value: metricsHash[curr.value][m]?.label_measurement,
        }));
        return [...acc, ...measures];
      }, []),
      (a, b) => (a?.toString() ?? '') === (b?.toString() ?? '')
    );

    const NoTiersEmptyState = () => (
      <Bullseye>
        <EmptyState
          headingLevel="h2"
          icon={PlusCircleIcon}
          titleText={intl.formatMessage(messages.costModelsWizardEmptyStateTitle)}
        >
          <EmptyStateBody>
            {intl.formatMessage(messages.costModelsWizardEmptyStateSkipStep, {
              value: <strong>{intl.formatMessage(messages.next)}</strong>,
            })}
            <br />
            {intl.formatMessage(messages.costModelsWizardEmptyStateOtherTime)}
          </EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );

    return (
      <CostModelContext.Consumer>
        {({ priceListPagination }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size={TitleSizes.xl}>
                  {intl.formatMessage(messages.costModelsWizardCreatePriceList)}
                </Title>
              </StackItem>
              <StackItem>
                <Content>
                  <Content component="p">{intl.formatMessage(messages.costModelsWizardSubTitleTable)}</Content>
                </Content>
              </StackItem>
              <StackItem>
                <WithPriceListSearch
                  initialFilters={{
                    primary: 'metrics',
                    metrics: [],
                    measurements: [],
                  }}
                >
                  {({ search, setSearch, onRemove, onSelect, onClearAll }) => {
                    const getMetric = value => getMetricLabel(value) || value;
                    const getMeasurement = (measurement, units) => {
                      if (!measurement) {
                        return '';
                      }
                      units = intl.formatMessage(messages.units, { units: unitsLookupKey(units) }) || units;
                      return intl.formatMessage(messages.measurementValues, {
                        value: measurement.toLowerCase().replace('-', '_'),
                        units,
                        count: 2,
                      });
                    };
                    const from = (priceListPagination.page - 1) * priceListPagination.perPage;
                    const to = priceListPagination.page * priceListPagination.perPage;
                    const filtered = items
                      .map((item, index) => {
                        return {
                          ...item,
                          stateIndex: index,
                        };
                      })
                      .filter(rate => search.metrics.length === 0 || search.metrics.includes(rate.metric.label_metric))
                      .filter(
                        rate =>
                          search.measurements.length === 0 ||
                          search.measurements.includes(rate.metric.label_measurement)
                      )
                      .sort((r1, r2) => {
                        const projection =
                          this.state.sortBy.index === 1
                            ? (r: Rate) => getMetric(r.metric.label_metric)
                            : this.state.sortBy.index === 2
                              ? (r: Rate) => getMeasurement(r.metric.label_measurement, r.metric.label_measurement_unit)
                              : () => '';
                        return compareBy(r1, r2, this.state.sortBy.direction, projection);
                      });
                    const res = filtered.slice(from, to);

                    return (
                      <>
                        <PriceListToolbar
                          primary={
                            <SelectWrapper
                              isDisabled={items.length === 0}
                              onSelect={(_evt, selection) => setSearch({ primary: selection.value })}
                              options={[
                                {
                                  toString: () => intl.formatMessage(messages.metric),
                                  value: 'metrics',
                                },
                                {
                                  toString: () => intl.formatMessage(messages.measurement),
                                  value: 'measurements',
                                },
                              ]}
                              placeholder={intl.formatMessage(messages.measurementPlaceholder)}
                              selection={search.primary}
                            />
                          }
                          selected={search.primary}
                          secondaries={[
                            {
                              component: (
                                <SelectCheckboxWrapper
                                  isDisabled={items.length === 0}
                                  onSelect={(_evt, selection) => onSelect('measurements', selection.value)}
                                  options={measurementOpts}
                                  placeholder={intl.formatMessage(messages.toolBarPriceListMeasurementPlaceHolder)}
                                  selections={search.measurements}
                                />
                              ),
                              name: 'measurements',
                              onRemove,
                              filters: search.measurements,
                            },
                            {
                              component: (
                                <SelectCheckboxWrapper
                                  isDisabled={items.length === 0}
                                  onSelect={(_evt, selection) => onSelect('metrics', selection.value)}
                                  options={metricOpts}
                                  placeholder={intl.formatMessage(messages.toolBarPriceListMetricPlaceHolder)}
                                  selections={search.metrics}
                                />
                              ),
                              name: 'metrics',
                              onRemove,
                              filters: search.metrics,
                            },
                          ]}
                          button={<Button onClick={addRateAction}>{intl.formatMessage(messages.createRate)}</Button>}
                          onClear={onClearAll}
                          pagination={
                            <Pagination
                              isCompact
                              itemCount={filtered.length}
                              perPage={priceListPagination.perPage}
                              page={priceListPagination.page}
                              onSetPage={(_evt, perPage) => priceListPagination.onPageSet(perPage)}
                              onPerPageSelect={(_evt, page) => priceListPagination.onPerPageSet(page)}
                              titles={{
                                paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                                  title: intl.formatMessage(messages.costModelsAssignSourcesParen),
                                  placement: 'top',
                                }),
                              }}
                            />
                          }
                        />
                        {res.length === 0 &&
                          (this.state.metrics.length !== 0 || this.state.measurements.length !== 0) && (
                            <Bullseye>
                              <EmptyFilterState />
                            </Bullseye>
                          )}
                        {res.length === 0 &&
                          this.state.metrics.length === 0 &&
                          this.state.measurements.length === 0 && <NoTiersEmptyState />}
                        {res.length > 0 && (
                          <RateTable
                            actions={[
                              {
                                title: intl.formatMessage(messages.remove),
                                onClick: (_evt, _rowId, rowData) => {
                                  deleteRateAction(rowData.data.stateIndex);
                                },
                              } as any,
                            ]}
                            tiers={res}
                            sortCallback={e => {
                              this.setState({
                                ...this.state,
                                sortBy: { ...e },
                              });
                            }}
                          />
                        )}
                        <PaginationToolbarTemplate
                          isCompact
                          itemCount={filtered.length}
                          perPage={priceListPagination.perPage}
                          page={priceListPagination.page}
                          onSetPage={(_evt, perPage) => priceListPagination.onPageSet(perPage)}
                          onPerPageSelect={(_evt, page) => priceListPagination.onPerPageSet(page)}
                          titles={{
                            paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                              title: intl.formatMessage(messages.costModelsAssignSourcesParen),
                              placement: 'bottom',
                            }),
                          }}
                        />
                      </>
                    );
                  }}
                </WithPriceListSearch>
              </StackItem>
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  }))
)(injectIntl(PriceListTable));
