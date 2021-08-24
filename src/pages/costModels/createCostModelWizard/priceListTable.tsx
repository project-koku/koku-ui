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
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import PaginationToolbarTemplate from 'pages/costModels/components/paginationToolbarTemplate';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { RateTable } from 'pages/costModels/components/rateTable';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';

import { CostModelContext } from './context';

interface Props extends WithTranslation {
  metricsHash: MetricHash;
  addRateAction: () => void;
  items: any[];
  deleteRateAction: (data: any) => void;
}

const NoTiersEmptyState = ({ t }) => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h2" size={TitleSizes.lg}>
        {t('cost_models_wizard.empty_state.title')}
      </Title>
      <EmptyStateBody>
        <Trans i18nKey="cost_models_wizard.empty_state.desc_create">
          <strong>{t('cost_models_wizard.price_list.create_rate')}</strong>
        </Trans>
        <br />
        <Trans i18nKey="cost_models_wizard.empty_state.desc_skip">
          <strong>{t('cost_models_wizard.empty_state.next')}</strong>
        </Trans>
        <br />
        <Trans i18nKey="cost_models_wizard.empty_state.desc_other_time" />
      </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

interface State {
  metrics: string[];
  measurements: string[];
}

class PriceListTable extends React.Component<Props, State> {
  public state = { metrics: [], measurements: [] };
  public render() {
    const { metricsHash, t, addRateAction, deleteRateAction, items } = this.props;
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: m,
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: m, value: m }));
      return [...acc, ...measurs];
    }, []);
    return (
      <CostModelContext.Consumer>
        {({ priceListPagination }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size={TitleSizes.xl}>
                  {t('cost_models_wizard.price_list.title')}
                </Title>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h6}>{t('cost_models_wizard.price_list.sub_title_table')}</Text>
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
                                  label: t('toolbar.pricelist.metric'),
                                  value: 'metrics',
                                },
                                {
                                  label: t('toolbar.pricelist.measurement'),
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
                                  placeholderText={t('toolbar.pricelist.measurement_placeholder')}
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
                                  placeholderText={t('toolbar.pricelist.metric_placeholder')}
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
                          button={
                            <Button onClick={addRateAction}>{t('cost_models_wizard.price_list.create_rate')}</Button>
                          }
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
                            <EmptyFilterState
                              filter={t('cost_models_wizard.price_list.toolbar_top_results_aria_label')}
                            />
                          </Bullseye>
                        )}
                        {res.length === 0 &&
                          this.state.metrics.length === 0 &&
                          this.state.measurements.length === 0 && <NoTiersEmptyState t={t} />}
                        {res.length > 0 && (
                          <RateTable
                            isCompact
                            t={t}
                            tiers={res}
                            actions={[
                              {
                                title: 'Remove',
                                onClick: (_evt, _rowId, rowData) => {
                                  deleteRateAction(rowData.data.index + from);
                                },
                              },
                            ]}
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
)(withTranslation()(PriceListTable));
