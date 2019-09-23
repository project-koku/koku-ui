import {
  Button,
  Chip,
  DataList,
  TextInput,
  Title,
  TitleSize,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { PriceListTierDataItem } from './priceListTier';

class PriceListTable extends React.Component<InjectedTranslateProps> {
  public state = { filter: '', current: '' };
  public render() {
    const { t } = this.props;
    return (
      <CostModelContext.Consumer>
        {({ tiers, goToAddPL, removeRate }) => {
          const res = tiers.filter(iter =>
            `${iter.measurement.toLowerCase()}-${iter.metric.toLowerCase()}`.includes(
              this.state.filter.toLowerCase()
            )
          );
          return (
            <>
              <Title size={TitleSize.xl}>
                {t('cost_models_wizard.price_list.title')}
              </Title>
              <Title size={TitleSize.md}>
                {t('cost_models_wizard.price_list.sub_title_table')}
              </Title>
              <Toolbar style={{ marginBottom: '10px', marginTop: '10px' }}>
                <ToolbarSection
                  aria-label={t(
                    'cost_models_wizard.price_list.toolbar_top_aria_label'
                  )}
                >
                  <ToolbarGroup>
                    <ToolbarItem>
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
                          this.setState({
                            filter: this.state.current,
                            current: '',
                          });
                        }}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <Button onClick={goToAddPL}>
                        {t('cost_models_wizard.price_list.add_another_rate')}
                      </Button>
                    </ToolbarItem>
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
                      <PriceListTierDataItem
                        key={`price-list-tier-item-${ix}`}
                        index={ix}
                        tier={tier}
                        removeRate={removeRate}
                      />
                    );
                  })}
                </DataList>
              )}
            </>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default translate()(PriceListTable);
