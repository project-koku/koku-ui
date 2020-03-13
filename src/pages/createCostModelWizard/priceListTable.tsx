import {
  Bullseye,
  Button,
  DataList,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { PlusCircleIcon /*SearchIcon*/ } from '@patternfly/react-icons';
import { MetricHash } from 'api/metrics';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import CostModelRateItem from 'pages/costModelsDetails/components/costModelRateItem';
import React from 'react';
import { InjectedTranslateProps, Interpolate, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { CostModelContext } from './context';
import { PriceListToolbar } from './Datatoolbar';
import { TierData } from './priceList';

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
      <Title size="lg">{t('cost_models_wizard.empty_state.title')}</Title>
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

    const onSelectItem = event => {
      let type = '';
      if (event.type === 'SELECT_METRICS') {
        type = 'metrics';
      }
      if (event.type === 'SELECT_MEASUREMENTS') {
        type = 'measurements';
      }
      const prev = this.state[type];
      if (prev.includes(event.selection)) {
        this.setState({
          ...this.state,
          [type]: prev.filter(x => x !== event.selection),
        });
        return;
      }
      this.setState({ ...this.state, [type]: [...prev, event.selection] });
    };
    return (
      <CostModelContext.Consumer>
        {({ priceListPagination }) => {
          const from =
            (priceListPagination.page - 1) * priceListPagination.perPage;
          const to = priceListPagination.page * priceListPagination.perPage;
          const filtered = items
            .filter(
              rate =>
                this.state.metrics.length === 0 ||
                this.state.metrics.includes(rate.metric)
            )
            .filter(
              rate =>
                this.state.measurements.length === 0 ||
                this.state.measurements.includes(rate.measurement)
            );
          const res = filtered.slice(from, to);
          return (
            <Stack gutter="md">
              <StackItem>
                <Title size={TitleSize.xl}>
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
                <PriceListToolbar
                  actionButtonText={t('toolbar.pricelist.add_rate')}
                  metricProps={{
                    options: metricOpts,
                    placeholder: t('toolbar.pricelist.metric_placeholder'),
                    selection: this.state.metrics,
                  }}
                  measurementProps={{
                    options: measurementOpts,
                    placeholder: t('toolbar.pricelist.measurement_placeholder'),
                    selection: this.state.measurements,
                  }}
                  onSelect={onSelectItem}
                  onClick={addRateAction}
                  pagination={{
                    isCompact: true,
                    itemCount: filtered.length,
                    perPage: priceListPagination.perPage,
                    page: priceListPagination.page,
                    onSetPage: priceListPagination.onPageSet,
                    onPerPageSelect: priceListPagination.onPerPageSet,
                    perPageOptions: [
                      { title: '2', value: 2 },
                      { title: '4', value: 4 },
                      { title: '6', value: 6 },
                    ],
                  }}
                  enableAddRate={maxRate === items.length}
                  filters={this.state as { [k: string]: string[] }}
                  onClear={() => {
                    this.setState({ metrics: [], measurements: [] });
                  }}
                  onRemoveFilter={(type: string, id: string) => {
                    switch (type) {
                      case t('toolbar.pricelist.metric_placeholder'):
                        return this.setState({
                          metrics: this.state.metrics.filter(m => m !== id),
                        });
                      case t('toolbar.pricelist.measurement_placeholder'):
                        return this.setState({
                          measurements: this.state.measurements.filter(
                            m => m !== id
                          ),
                        });
                    }
                  }}
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
                  <DataList
                    aria-label={t(
                      'cost_models_wizard.price_list.data_list_aria_label'
                    )}
                  >
                    {res.map((tier, ix) => {
                      return (
                        <CostModelRateItem
                          key={ix}
                          index={ix}
                          units={tier.meta.label_measurement_unit}
                          metric={tier.metric}
                          measurement={tier.measurement}
                          rate={tier.rate}
                          actionComponent={
                            <Button
                              variant="link"
                              onClick={() => deleteRateAction(tier)}
                            >
                              {t('cost_models.remove_button')}
                            </Button>
                          }
                        />
                      );
                    })}
                  </DataList>
                )}
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
