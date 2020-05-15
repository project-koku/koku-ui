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
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { CostModelContext } from './context';

interface MarkupValidationState {
  isValid: boolean;
}

class Markup extends React.Component<
  WrappedComponentProps,
  MarkupValidationState
> {
  public state = {
    isValid: true,
  };

  public render() {
    const { intl } = this.props;
    const { isValid } = this.state;

    return (
      <CostModelContext.Consumer>
        {({ onMarkupChange, markup }) => {
          return (
            <Stack gutter="md">
              <StackItem>
                <Title size="xl">
                  {intl.formatMessage({
                    id: 'cost_models_wizard.markup.title',
                  })}
                </Title>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h6}>
                    {intl.formatMessage({
                      id: 'cost_models_wizard.markup.sub_title',
                    })}
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Form>
                  <FormGroup
                    label={intl.formatMessage({
                      id: 'cost_models_wizard.markup.markup_label',
                    })}
                    fieldId="markup"
                    helperTextInvalid={intl.formatMessage({
                      id: 'cost_models_wizard.markup.invalid_markup_text',
                    })}
                    isValid={isValid}
                  >
                    <InputGroup style={{ width: '150px' }}>
                      <TextInput
                        type="text"
                        id="markup"
                        name="markup"
                        value={markup}
                        onBlur={() => {
                          this.setState({ isValid: !isNaN(Number(markup)) });
                        }}
                        onChange={(value: string) => {
                          onMarkupChange(value);
                          if (value !== '-') {
                            this.setState({ isValid: !isNaN(Number(value)) });
                          }
                        }}
                        isValid={isValid}
                      />
                      <InputGroupText style={{ borderLeft: '0' }}>
                        %
                      </InputGroupText>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </StackItem>
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default injectIntl(Markup);
