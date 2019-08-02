import { FormGroup, TextInput, Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';

const Markup: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ onMarkupChange, markup }) => {
      const isValidMarkup = !isNaN(Number(markup));
      return (
        <>
          <Title size="xl">{t('cost_models_wizard.markup.title')}</Title>
          <Title size="md">{t('cost_models_wizard.markup.sub_title')}</Title>
          <FormGroup
            label={t('cost_models_wizard.markup.markup_label')}
            isRequired
            fieldId="markup"
            helperTextInvalid={t(
              'cost_models_wizard.markup.invalid_markup_text'
            )}
            isValid={isValidMarkup}
          >
            <TextInput
              isRequired
              type="text"
              id="markup"
              name="markup"
              value={markup}
              onChange={onMarkupChange}
              isValid={isValidMarkup}
            />
          </FormGroup>
        </>
      );
    }}
  </CostModelContext.Consumer>
);

export default translate()(Markup);
