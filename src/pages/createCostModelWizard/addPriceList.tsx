import {
  Button,
  FormGroup,
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { units } from './priceListTier';
import { styles } from './wizard.styles';

const hash = [
  { measurement: 'usage', metric: 'cpu' },
  { measurement: 'usage', metric: 'memory' },
  { measurement: 'usage', metric: 'storage' },
  { measurement: 'request', metric: 'cpu' },
  { measurement: 'request', metric: 'memory' },
  { measurement: 'request', metric: 'storage' },
  { measurement: 'currency', metric: 'node' },
];

const unusedRates = (tiers: { metric: string; measurement: string }[]) => {
  return hash.reduce((acc, curr) => {
    if (
      tiers.find(
        tier =>
          tier.measurement === curr.measurement && tier.metric === curr.metric
      )
    ) {
      return acc;
    }
    const oldMeasurements = acc[curr.metric] || [];
    return { ...acc, [curr.metric]: [...oldMeasurements, curr.measurement] };
  }, {});
};

const AddPriceList: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({ priceListCurrent, updateCurrentPL, submitCurrentPL, tiers }) => {
        const availableRates = unusedRates(tiers);
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
                  {t('cost_models_wizard.price_list.sub_title_add')}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form className={css(styles.form)}>
                <FormGroup
                  label={t('cost_models_wizard.price_list.metric_label')}
                  fieldId="metric-selector"
                >
                  <FormSelect
                    value={priceListCurrent.metric}
                    onChange={(value: string) =>
                      updateCurrentPL('metric', value)
                    }
                    aria-label={t(
                      'cost_models_wizard.price_list.metric_selector_aria_label'
                    )}
                    id="metric-selector"
                  >
                    <FormSelectOption
                      isDisabled
                      value=""
                      label={t(
                        'cost_models_wizard.price_list.default_selector_label'
                      )}
                    />
                    {Object.keys(availableRates).map(metric => (
                      <FormSelectOption
                        value={metric}
                        label={t(
                          `cost_models_wizard.price_list.${metric}_metric`
                        )}
                      />
                    ))}
                  </FormSelect>
                </FormGroup>
                {priceListCurrent.metric !== '' && (
                  <FormGroup
                    label={t('cost_models_wizard.price_list.measurement_label')}
                    fieldId="measurement-selector"
                  >
                    <FormSelect
                      value={priceListCurrent.measurement}
                      onChange={(value: string) =>
                        updateCurrentPL('measurement', value)
                      }
                      aria-label={t(
                        'cost_models_wizard.price_list.measurement_selector_aria_label'
                      )}
                      id="measurement-selector"
                    >
                      <FormSelectOption
                        isDisabled
                        value=""
                        label={t(
                          'cost_models_wizard.price_list.default_selector_label'
                        )}
                      />
                      {availableRates[priceListCurrent.metric].map(
                        measurement => (
                          <FormSelectOption
                            value={measurement}
                            label={t(
                              `cost_models_wizard.price_list.${measurement}`,
                              {
                                units: units(priceListCurrent.metric),
                              }
                            )}
                          />
                        )
                      )}
                    </FormSelect>
                  </FormGroup>
                )}
                {priceListCurrent.measurement !== '' && (
                  <FormGroup
                    label={t('cost_models_wizard.price_list.rate_label')}
                    fieldId="rate-input-box"
                    helperTextInvalid={t(
                      'cost_models_wizard.price_list.rate_error'
                    )}
                    isValid={
                      !isNaN(Number(priceListCurrent.rate)) &&
                      Number(priceListCurrent.rate) >= 0
                    }
                  >
                    <InputGroup>
                      <InputGroupText>
                        <DollarSignIcon />
                      </InputGroupText>
                      <TextInput
                        type="text"
                        aria-label={t(
                          'cost_models_wizard.price_list.rate_aria_label'
                        )}
                        id="rate-input-box"
                        placeholder="0.00"
                        value={priceListCurrent.rate}
                        onChange={(value: string) =>
                          updateCurrentPL('rate', value)
                        }
                        isValid={
                          !isNaN(Number(priceListCurrent.rate)) &&
                          Number(priceListCurrent.rate) >= 0
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                )}
                {priceListCurrent.measurement !== '' && (
                  <div>
                    <Button
                      onClick={submitCurrentPL}
                      isDisabled={
                        priceListCurrent.rate === '' ||
                        isNaN(Number(priceListCurrent.rate))
                      }
                    >
                      {t('cost_models_wizard.price_list.save_rate')}
                    </Button>
                  </div>
                )}
              </Form>
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(AddPriceList);
