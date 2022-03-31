import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Pagination,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { MetricHash } from 'api/metrics';
import messages from 'locales/messages';
import { EmptyFilterState } from 'pages/components/state/emptyFilterState/emptyFilterState';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import PaginationToolbarTemplate from 'pages/costModels/components/paginationToolbarTemplate';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { RateTable } from 'pages/costModels/components/rateTable';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';

import { CostModelContext } from './context';

interface Props extends WrappedComponentProps {
  addRateAction: () => void;
  deleteRateAction: (data: any) => void;
  items: any[];
  metricsHash: MetricHash;
}

interface State {
  metrics: string[];
  measurements: string[];
}

class PriceListTable extends React.Component<Props, State> {
  public state = { metrics: [], measurements: [] };
  public render() {
    const { addRateAction, deleteRateAction, intl, items, metricsHash } = this.props;

    const getMetricLabel = m => {
      // Match message descriptor or default to API string
      const value = m.replace(/ /g, '_').toLowerCase();
      const label = intl.formatMessage(messages.MetricValues, { value });
      return label ? label : m;
    };
    const getMeasurementLabel = m => {
      // Match message descriptor or default to API string
      const label = intl.formatMessage(messages.MeasurementValues, {
        value: m.toLowerCase().replace('-', '_'),
        count: 1,
      });
      return label ? label : m;
    };
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: getMetricLabel(m),
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: getMeasurementLabel(m), value: m }));
      return [...acc, ...measurs];
    }, []);

    const NoTiersEmptyState = () => (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={PlusCircleIcon} />
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.CostModelsWizardEmptyStateTitle)}
          </Title>
          <EmptyStateBody>
            {intl.formatMessage(messages.CostModelsWizardEmptyStateSkipStep, {
              value: <strong>{intl.formatMessage(messages.CreateRate)}</strong>,
            })}
            <br />
            {intl.formatMessage(messages.CostModelsWizardEmptyStateSkipStep, {
              value: <strong>{intl.formatMessage(messages.Next)}</strong>,
            })}
            <br />
            {intl.formatMessage(messages.CostModelsWizardEmptyStateOtherTime)}
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
                  {intl.formatMessage(messages.CostModelsWizardCreatePriceList)}
                </Title>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h6}>{intl.formatMessage(messages.CostModelsWizardSubTitleTable)}</Text>
                </TextContent>
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
                    const from = (priceListPagination.page - 1) * priceListPagination.perPage;
                    const to = priceListPagination.page * priceListPagination.perPage;
                    const filtered = items
                      .filter(rate => search.metrics.length === 0 || search.metrics.includes(rate.metric.label_metric))
                      .filter(
                        rate =>
                          search.measurements.length === 0 ||
                          search.measurements.includes(rate.metric.label_measurement)
                      );
                    const res = filtered.slice(from, to);
                    return (
                      <>
                        <PriceListToolbar
                          primary={
                            <PrimarySelector
                              isDisabled={items.length === 0}
                              primary={search.primary}
                              setPrimary={(primary: string) => setSearch({ primary })}
                              options={[
                                {
                                  label: intl.formatMessage(messages.Metric),
                                  value: 'metrics',
                                },
                                {
                                  label: intl.formatMessage(messages.Measurement),
                                  value: 'measurements',
                                },
                              ]}
                            />
                          }
                          selected={search.primary}
                          secondaries={[
                            {
                              component: (
                                <CheckboxSelector
                                  isDisabled={items.length === 0}
                                  placeholderText={intl.formatMessage(messages.ToolBarPriceListMeasurementPlaceHolder)}
                                  selections={search.measurements}
                                  setSelections={(selection: string) => onSelect('measurements', selection)}
                                  options={measurementOpts}
                                />
                              ),
                              name: 'measurements',
                              onRemove,
                              filters: search.measurements,
                            },
                            {
                              component: (
                                <CheckboxSelector
                                  isDisabled={items.length === 0}
                                  placeholderText={intl.formatMessage(messages.ToolBarPriceListMetricPlaceHolder)}
                                  selections={search.metrics}
                                  setSelections={(selection: string) => onSelect('metrics', selection)}
                                  options={metricOpts}
                                />
                              ),
                              name: 'metrics',
                              onRemove,
                              filters: search.metrics,
                            },
                          ]}
                          button={<Button onClick={addRateAction}>{intl.formatMessage(messages.CreateRate)}</Button>}
                          onClear={onClearAll}
                          pagination={
                            <Pagination
                              isCompact
                              itemCount={filtered.length}
                              perPage={priceListPagination.perPage}
                              page={priceListPagination.page}
                              onSetPage={priceListPagination.onPageSet}
                              onPerPageSelect={priceListPagination.onPerPageSet}
                            />
                          }
                        />
                        {res.length === 0 && (this.state.metrics.length !== 0 || this.state.measurements.length !== 0) && (
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
                                title: 'Remove',
                                onClick: (_evt, _rowId, rowData) => {
                                  deleteRateAction(rowData.data.index + from);
                                },
                              },
                            ]}
                            isCompact
                            tiers={res}
                          />
                        )}
                        <PaginationToolbarTemplate
                          isCompact
                          itemCount={filtered.length}
                          perPage={priceListPagination.perPage}
                          page={priceListPagination.page}
                          onSetPage={priceListPagination.onPageSet}
                          onPerPageSelect={priceListPagination.onPerPageSet}
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
