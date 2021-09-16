import {
  Flex,
  FlexItem,
  FormGroup,
  InputGroup,
  InputGroupText,
  List,
  ListItem,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { Form } from 'components/forms/form';
import messages from 'locales/messages';
import { styles } from 'pages/costModels/costModel/costCalc.styles';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { CostModelContext } from './context';

class MarkupWithDistribution extends React.Component<WrappedComponentProps> {
  public render() {
    const { intl } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          handleDistributionChange,
          handleSignChange,
          handleOnKeyDown,
          handleMarkupDiscountChange,
          markupValidator,
          markup,
          isDiscount,
          distribution,
          type,
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size={TitleSizes.xl}>
                  {intl.formatMessage(messages.CostCalculations)}
                </Title>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.MarkupOrDiscount)}
                </Title>
                {intl.formatMessage(messages.MarkupOrDiscountModalDesc)}
              </StackItem>
              <StackItem>
                <Flex style={styles.markupRadioContainer}>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <Radio
                        isChecked={!isDiscount}
                        name="discount"
                        label={intl.formatMessage(messages.MarkupPlus)}
                        aria-label={intl.formatMessage(messages.MarkupPlus)}
                        id="markup"
                        value="false" // "+"
                        onChange={handleSignChange}
                        style={styles.markupRadio}
                      />
                      <Radio
                        isChecked={isDiscount}
                        name="discount"
                        label={intl.formatMessage(messages.DiscountMinus)}
                        aria-label={intl.formatMessage(messages.DiscountMinus)}
                        id="discount"
                        value="true" // '-'
                        onChange={handleSignChange}
                      />
                    </FlexItem>
                  </Flex>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <InputGroup style={styles.rateContainer}>
                        <InputGroupText style={styles.sign}>
                          {isDiscount
                            ? intl.formatMessage(messages.DiscountMinus)
                            : intl.formatMessage(messages.MarkupPlus)}
                        </InputGroupText>
                        <TextInput
                          style={styles.inputField}
                          type="text"
                          aria-label={intl.formatMessage(messages.Rate)}
                          id="markup-input-box"
                          value={markup}
                          onKeyDown={handleOnKeyDown}
                          onChange={handleMarkupDiscountChange}
                          validated={markupValidator()}
                        />
                        <InputGroupText style={styles.percent}>
                          {intl.formatMessage(messages.PercentSymbol)}
                        </InputGroupText>
                      </InputGroup>
                    </FlexItem>
                  </Flex>
                </Flex>
              </StackItem>
              <StackItem>
                <div style={styles.exampleMargin}>
                  <TextContent>
                    <Text component={TextVariants.h6}>{intl.formatMessage(messages.ExamplesTitle)}</Text>
                  </TextContent>
                  <List>
                    <ListItem>{intl.formatMessage(messages.CostModelsExamplesNoAdjust)}</ListItem>
                    <ListItem>{intl.formatMessage(messages.CostModelsExamplesDoubleMarkup)}</ListItem>
                    <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceZero)}</ListItem>
                    <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceSeventyfive)}</ListItem>
                  </List>
                </div>
              </StackItem>
              {type === 'OCP' && (
                <>
                  <StackItem>
                    <Title headingLevel="h3" size="md">
                      {intl.formatMessage(messages.DistributionType)}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>{intl.formatMessage(messages.DistributionModelDesc)}</Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution" isRequired>
                        <Radio
                          isChecked={distribution === 'cpu'}
                          name="distribution"
                          label={intl.formatMessage(messages.CpuTitle)}
                          aria-label={intl.formatMessage(messages.CpuTitle)}
                          id="cpuDistribution"
                          value="cpu"
                          onChange={handleDistributionChange}
                        />
                        <Radio
                          isChecked={distribution === 'memory'}
                          name="distribution"
                          label={intl.formatMessage(messages.MemoryTitle)}
                          aria-label={intl.formatMessage(messages.MemoryTitle)}
                          id="memoryDistribution"
                          value="memory"
                          onChange={handleDistributionChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </>
              )}
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default injectIntl(MarkupWithDistribution);
