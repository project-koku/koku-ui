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
import { PlusCircleIcon } from '@patternfly/react-icons';
import { MetricHash } from 'api/metrics';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { TierData } from 'pages/costModels/components/addPriceList';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { InjectedTranslateProps, Interpolate, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { RateTable } from '../components/rateTable';
import { CostModelContext } from './context';

interface Props extends InjectedTranslateProps {
  metricsHash: MetricHash;
  maxRate: number;
  addRateAction: () => void;
  items: TierData[];
  deleteRateAction: (data: TierData) => void;
}

const NoTiersEmptyState = ({ t }) => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h1" size="lg">
        {t('cost_models_wizard.empty_state.title')}
      </Title>
      <EmptyStateBody>
        <Interpolate
          i18nKey="cost_models_wizard.empty_state.desc_create"
          add_rate={
            <strong>{t('cost_models_wizard.empty_state.add_rate')}</strong>
          }
        />
        <br />
        <Interpolate
          i18nKey="cost_models_wizard.empty_state.desc_skip"
          next={<strong>{t('cost_models_wizard.empty_state.next')}</strong>}
        />
        <br />
        <Interpolate i18nKey="cost_models_wizard.empty_state.desc_other_time" />
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
    const {
      metricsHash,
      t,
      maxRate,
      addRateAction,
      deleteRateAction,
      items,
    } = this.props;
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: t(`cost_models.${m}`),
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: t(`toolbar.pricelist.options.${m}`), value: m }));
      return [...acc, ...measurs];
    }, []);
    return (
      <CostModelContext.Consumer>
        {({ priceListPagination }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h1" size={TitleSizes.xl}>
                  {t('cost_models_wizard.price_list.title')}
                </Title>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h6}>
                    {t('cost_models_wizard.price_list.sub_title_table')}
                  </Text>
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
                    const from =
                      (priceListPagination.page - 1) *
                      priceListPagination.perPage;
                    const to =
                      priceListPagination.page * priceListPagination.perPage;
                    const filtered = items
                      .filter(
                        rate =>
                          search.metrics.length === 0 ||
                          search.metrics.includes(rate.metric)
                      )
                      .filter(
                        rate =>
                          search.measurements.length === 0 ||
                          search.measurements.includes(rate.measurement)
                      );
                    const res = filtered.slice(from, to);
                    return (
                      <>
                        <PriceListToolbar
                          primary={
                            <PrimarySelector
                              isDisabled={items.length === 0}
                              primary={search.primary}
                              setPrimary={(primary: string) =>
                                setSearch({ primary })
                              }
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
                                  placeholderText={t(
                                    'toolbar.pricelist.measurement_placeholder'
                                  )}
                                  selections={search.measurements}
                                  setSelections={(selection: string) =>
                                    onSelect('measurements', selection)
                                  }
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
                                  placeholderText={t(
                                    'toolbar.pricelist.metric_placeholder'
                                  )}
                                  selections={search.metrics}
                                  setSelections={(selection: string) =>
                                    onSelect('metrics', selection)
                                  }
                                  options={metricOpts}
                                />
                              ),
                              name: 'metrics',
                              onRemove,
                              filters: search.metrics,
                            },
                          ]}
                          button={
                            <Button
                              isDisabled={maxRate === items.length}
                              onClick={addRateAction}
                            >
                              {t('toolbar.pricelist.add_rate')}
                            </Button>
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
                              perPageOptions={[
                                { title: '2', value: 2 },
                                { title: '4', value: 4 },
                                { title: '6', value: 6 },
                              ]}
                            />
                          }
                        />
                        {res.length === 0 &&
                          (this.state.metrics.length !== 0 ||
                            this.state.measurements.length !== 0) && (
                            <Bullseye>
                              <EmptyFilterState
                                filter={t(
                                  'cost_models_wizard.price_list.toolbar_top_results_aria_label'
                                )}
                              />
                            </Bullseye>
                          )}
                        {res.length === 0 &&
                          this.state.metrics.length === 0 &&
                          this.state.measurements.length === 0 && (
                            <NoTiersEmptyState t={t} />
                          )}
                        {res.length > 0 && (
                          <RateTable
                            isCompact
                            t={t}
                            tiers={res}
                            actions={[
                              {
                                title: 'Remove',
                                onClick: (_evt, rowId, _rowData, _extra) => {
                                  deleteRateAction(res[rowId]);
                                },
                              },
                            ]}
                          />
                        )}
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
    maxRate: metricsSelectors.maxRate(state),
  }))
)(translate()(PriceListTable));
