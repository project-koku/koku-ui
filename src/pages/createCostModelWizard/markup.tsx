import {
  FormGroup,
  InputGroup,
  InputGroupText,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';

const Markup: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ onMarkupChange, markup }) => {
      const isValidMarkup = !isNaN(Number(markup));
      return (
        <Stack gutter="md">
          <StackItem>
            <Title size="xl">{t('cost_models_wizard.markup.title')}</Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h6}>
                {t('cost_models_wizard.markup.sub_title')}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Form>
              <FormGroup
                label={t('cost_models_wizard.markup.markup_label')}
                fieldId="markup"
                helperTextInvalid={t(
                  'cost_models_wizard.markup.invalid_markup_text'
                )}
                isValid={isValidMarkup}
              >
                <InputGroup style={{ width: '150px' }}>
                  <TextInput
                    type="text"
                    id="markup"
                    name="markup"
                    value={markup}
                    onChange={onMarkupChange}
                    isValid={isValidMarkup}
                    placeholder={'0'}
                  />
                  <InputGroupText style={{ borderLeft: '0' }}>%</InputGroupText>
                </InputGroup>
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      );
    }}
  </CostModelContext.Consumer>
);

export default translate()(Markup);
