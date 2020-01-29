import {
  Button,
  Chip,
  DataList,
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
import { SearchIcon } from '@patternfly/react-icons';
import { MetricHash } from 'api/metrics';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { metricsSelectors } from 'store/metrics';
import { createMapStateToProps } from '../../store/common';
import CostModelRateItem from '../costModelsDetails/components/costModelRateItem';
import { CostModelContext } from './context';

interface Props extends InjectedTranslateProps {
  metricsHash: MetricHash;
  maxRate: number;
}

class PriceListTable extends React.Component<Props> {
  public state = { filter: '', current: '' };
  public render() {
    const { t, metricsHash, maxRate } = this.props;
    return (
      <CostModelContext.Consumer>
        {({ tiers, goToAddPL, removeRate, priceListPagination }) => {
          const from =
            (priceListPagination.page - 1) * priceListPagination.perPage;
          const to = priceListPagination.page * priceListPagination.perPage;
          const filtered = tiers.filter(iter =>
            `${iter.measurement.toLowerCase()}-${iter.metric.toLowerCase()}`.includes(
              this.state.filter.toLowerCase()
            )
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
                          isDisabled={tiers.length === maxRate}
                          onClick={goToAddPL}
                        >
                          {t('cost_models_wizard.price_list.add_another_rate')}
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
                          units={
                            metricsHash[tier.metric][tier.measurement]
                              .label_measurement_unit
                          }
                          metric={tier.metric}
                          measurement={tier.measurement}
                          rate={tier.rate}
                          actionComponent={
                            <Button
                              variant="link"
                              onClick={() => removeRate(ix)}
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
