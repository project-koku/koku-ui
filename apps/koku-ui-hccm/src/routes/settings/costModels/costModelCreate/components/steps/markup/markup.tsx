import {
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  List,
  ListItem,
  Radio,
  Stack,
  StackItem,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { styles } from './markup.styles';

interface MarkupOwnProps {
  isDiscount?: boolean;
  markup?: string;
  markupError?: MessageDescriptor;
  onDiscountChange?: (isDiscount: boolean) => void;
  onMarkupChange?: (value: string) => void;
}

type MarkupProps = MarkupOwnProps;

const Markup: React.FC<MarkupProps> = ({
  isDiscount = false,
  markup,
  markupError,
  onDiscountChange,
  onMarkupChange,
}: MarkupProps) => {
  const intl = useIntl();

  const handleOnKeyDown = event => {
    // Prevent 'Enter', '+', and '-'
    if (event.key === 'Enter' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl} style={styles.titleWithLearnMore}>
          {intl.formatMessage(messages.costCalculationsOptional)}
        </Title>
        <a href={intl.formatMessage(messages.docsCostModelsMarkup)} rel="noreferrer" target="_blank">
          {intl.formatMessage(messages.learnMore)}
        </a>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size={TitleSizes.md}>
          {intl.formatMessage(messages.markupOrDiscount)}
        </Title>
        <Content>
          <Content component="p">{intl.formatMessage(messages.markupOrDiscountModalDesc)}</Content>
        </Content>
      </StackItem>
      <StackItem>
        <Flex style={styles.markupRadioContainer}>
          <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem>
              <Radio
                aria-label={intl.formatMessage(messages.markupPlus)}
                id="markup"
                isChecked={!isDiscount}
                label={intl.formatMessage(messages.markupPlus)}
                name="discount"
                onChange={() => onDiscountChange?.(false)}
                style={styles.markupRadio}
                value="false" // "+"
              />
              <Radio
                aria-label={intl.formatMessage(messages.discountMinus)}
                id="discount"
                isChecked={isDiscount}
                label={intl.formatMessage(messages.discountMinus)}
                name="discount"
                onChange={() => onDiscountChange?.(true)}
                style={styles.markupRadio}
                value="true" // '-'
              />
            </FlexItem>
          </Flex>
          <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem>
              <Form onSubmit={event => event.preventDefault()}>
                <FormGroup fieldId="markup-input-box" style={styles.rateContainer}>
                  <InputGroup>
                    <InputGroupText style={styles.sign}>
                      {isDiscount
                        ? intl.formatMessage(messages.discountMinus)
                        : intl.formatMessage(messages.markupPlus)}
                    </InputGroupText>
                    <InputGroupItem isFill>
                      <TextInput
                        aria-label={intl.formatMessage(messages.rate)}
                        id="markup-input-box"
                        isRequired
                        onChange={(_event, value) => onMarkupChange?.(value)}
                        onKeyDown={handleOnKeyDown}
                        placeholder={'0'}
                        style={styles.inputField}
                        type="text"
                        validated={markupError ? 'error' : 'default'}
                        value={markup}
                      />
                    </InputGroupItem>
                    <InputGroupText style={styles.percent}>{intl.formatMessage(messages.percentSymbol)}</InputGroupText>
                  </InputGroup>
                  {markupError && (
                    <HelperText>
                      <HelperTextItem variant="error">{intl.formatMessage(markupError)}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </Form>
            </FlexItem>
          </Flex>
        </Flex>
      </StackItem>
      <StackItem>
        <div style={styles.exampleMargin}>
          <Content>
            <Content component={ContentVariants.h3}>{intl.formatMessage(messages.examplesTitle)}</Content>
          </Content>
          <List>
            <ListItem>{intl.formatMessage(messages.costModelsExamplesNoAdjust)}</ListItem>
            <ListItem>{intl.formatMessage(messages.costModelsExamplesDoubleMarkup)}</ListItem>
            <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceZero)}</ListItem>
            <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceSeventyfive)}</ListItem>
          </List>
        </div>
      </StackItem>
    </Stack>
  );
};

export { Markup };
