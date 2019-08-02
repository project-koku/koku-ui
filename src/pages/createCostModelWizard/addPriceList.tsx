import {
  Button,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { units } from './priceListTier';

const AddPriceList: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({ priceListCurrent, updateCurrentPL, submitCurrentPL }) => {
        return (
          <>
            <Title size={TitleSize.xl}>
              {t('cost_models_wizard.price_list.title')}
            </Title>
            <Title size={TitleSize.md}>
              {t('cost_models_wizard.price_list.sub_title_add')}
            </Title>
            <FormGroup
              label={t('cost_models_wizard.price_list.metric_label')}
              fieldId="metric-selector"
            >
              <FormSelect
                value={priceListCurrent.metric}
                onChange={(value: string) => updateCurrentPL('metric', value)}
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
                <FormSelectOption
                  value="cpu"
                  label={t('cost_models_wizard.price_list.cpu_metric')}
                />
                <FormSelectOption
                  value="memory"
                  label={t('cost_models_wizard.price_list.memory_metric')}
                />
                <FormSelectOption
                  value="storage"
                  label={t('cost_models_wizard.price_list.storage_metric')}
                />
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
                  <FormSelectOption
                    value="request"
                    label={t('cost_models_wizard.price_list.request', {
                      units: units(priceListCurrent.metric),
                    })}
                  />
                  <FormSelectOption
                    value="usage"
                    label={t('cost_models_wizard.price_list.usage', {
                      units: units(priceListCurrent.metric),
                    })}
                  />
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
                <TextInput
                  type="text"
                  aria-label={t(
                    'cost_models_wizard.price_list.rate_aria_label'
                  )}
                  id="rate-input-box"
                  value={priceListCurrent.rate}
                  onChange={(value: string) => updateCurrentPL('rate', value)}
                  isValid={
                    !isNaN(Number(priceListCurrent.rate)) &&
                    Number(priceListCurrent.rate) >= 0
                  }
                />
              </FormGroup>
            )}
            {priceListCurrent.measurement !== '' && (
              <div style={{ paddingTop: '20px' }}>
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
          </>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(AddPriceList);
