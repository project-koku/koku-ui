import {
  Bullseye,
  Button,
  Chip,
  DataList,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  InputGroup,
  InputGroupText,
  Pagination,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSize,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import { MetricHash } from 'api/metrics';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { InjectedTranslateProps, Interpolate, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { metricsSelectors } from 'store/metrics';
import { createMapStateToProps } from '../../store/common';
import CostModelRateItem from '../costModelsDetails/components/costModelRateItem';
import { CostModelContext } from './context';
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

class PriceListTable extends React.Component<Props> {
  public state = { filter: '', current: '' };
  public render() {
    const { t, maxRate, addRateAction, deleteRateAction, items } = this.props;
    return (
      <CostModelContext.Consumer>
        {({ priceListPagination }) => {
          const from =
            (priceListPagination.page - 1) * priceListPagination.perPage;
          const to = priceListPagination.page * priceListPagination.perPage;
          const filtered = items.filter(rate => {
            const searchTerm = this.state.filter.toLowerCase();
            return (
              rate.measurement.toLowerCase().includes(searchTerm) ||
              rate.metric.toLowerCase().includes(searchTerm) ||
              rate.meta.label_measurement_unit
                .toLocaleLowerCase()
                .includes(searchTerm)
            );
          });
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
                <Toolbar style={{ marginBottom: '10px', marginTop: '10px' }}>
                  <ToolbarSection
                    aria-label={t(
                      'cost_models_wizard.price_list.toolbar_top_aria_label'
                    )}
                  >
                    <ToolbarGroup>
                      <ToolbarItem>
                        <InputGroup>
                          <TextInput
                            id="create-cost-model-price-list-filter"
                            type="text"
                            placeholder={t(
                              'cost_models_wizard.price_list.filter_placeholder'
                            )}
                            value={this.state.current}
                            onChange={value => {
                              this.setState({ current: value });
                            }}
                            onKeyPress={event => {
                              if (event.key !== 'Enter') {
                                return;
                              }
                              this.setState(
                                {
                                  filter: this.state.current,
                                  current: '',
                                },
                                () => {
                                  priceListPagination.onPageSet(undefined, 1);
                                }
                              );
                            }}
                          />
                          <InputGroupText style={{ borderLeft: '0' }}>
                            <SearchIcon />
                          </InputGroupText>
                        </InputGroup>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <ToolbarItem>
                        <Button
                          isDisabled={filtered.length === maxRate}
                          onClick={addRateAction}
                        >
                          {t('cost_models_wizard.price_list.add_rate')}
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup style={{ marginLeft: 'auto' }}>
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
                    </ToolbarGroup>
                  </ToolbarSection>
                  <ToolbarSection
                    aria-label={t(
                      'cost_models_wizard.price_list.toolbar_top_results_aria_label'
                    )}
                  >
                    <ToolbarGroup>
                      <ToolbarItem>
                        <Title size={TitleSize.md}>
                          {t('cost_models_wizard.price_list.results_text', {
                            num: res.length,
                          })}
                        </Title>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <ToolbarItem>
                        {this.state.filter && (
                          <Chip
                            style={{ paddingRight: '20px' }}
                            onClick={() => this.setState({ filter: '' })}
                          >
                            {this.state.filter}
                          </Chip>
                        )}
                      </ToolbarItem>
                    </ToolbarGroup>
                  </ToolbarSection>
                </Toolbar>
                {res.length === 0 && this.state.filter !== '' && (
                  <EmptyFilterState
                    filter={t(
                      'cost_models_wizard.price_list.toolbar_top_results_aria_label'
                    )}
                  />
                )}
                {res.length === 0 && <NoTiersEmptyState t={t} />}
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
