import messages from '@koku-ui/i18n/locales/messages';
import {
  Content,
  ContentVariants,
  Flex,
  FlexItem,
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
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { countDecimals, isPercentageFormatValid } from '../../../../utils/format';
import { Form } from '../components/forms/form';
import { styles as costCalcStyles } from '../costModel/costCalc.styles';
import { CostModelContext } from './context';
import { styles } from './wizard.styles';

interface MarkupWithDistributionOwnProps extends WrappedComponentProps {
  // TBD...
}

interface MarkupWithDistributionStateProps {
  // TBD...
}

type MarkupWithDistributionProps = MarkupWithDistributionOwnProps & MarkupWithDistributionStateProps;

class MarkupWithDistributionBase extends React.Component<MarkupWithDistributionProps, any> {
  public render() {
    const { intl } = this.props;

    const handleOnKeyDown = event => {
      // Prevent 'enter', '+', and '-'
      if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
        event.preventDefault();
      }
    };

    const markupValidator = value => {
      if (!isPercentageFormatValid(value)) {
        return messages.markupOrDiscountNumber;
      }
      // Test number of decimals
      const decimals = countDecimals(value);
      if (decimals > 10) {
        return messages.markupOrDiscountTooLong;
      }
      return undefined;
    };

    return (
      <CostModelContext.Consumer>
        {({ handleSignChange, handleMarkupDiscountChange, markup, isDiscount }) => {
          const helpText = markupValidator(markup);
          const validated = helpText ? 'error' : 'default';

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
                <Flex style={costCalcStyles.markupRadioContainer}>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <Radio
                        isChecked={!isDiscount}
                        name="discount"
                        label={intl.formatMessage(messages.markupPlus)}
                        aria-label={intl.formatMessage(messages.markupPlus)}
                        id="markup"
                        value="false" // "+"
                        onChange={handleSignChange}
                        style={costCalcStyles.markupRadio}
                      />
                      <Radio
                        isChecked={isDiscount}
                        name="discount"
                        label={intl.formatMessage(messages.discountMinus)}
                        aria-label={intl.formatMessage(messages.discountMinus)}
                        id="discount"
                        value="true" // '-'
                        onChange={handleSignChange}
                      />
                    </FlexItem>
                  </Flex>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <Form>
                        <FormGroup fieldId="markup-input-box" style={costCalcStyles.rateContainer}>
                          <InputGroup>
                            <InputGroupText style={costCalcStyles.sign}>
                              {isDiscount
                                ? intl.formatMessage(messages.discountMinus)
                                : intl.formatMessage(messages.markupPlus)}
                            </InputGroupText>
                            <InputGroupItem isFill>
                              <TextInput
                                aria-label={intl.formatMessage(messages.rate)}
                                id="markup-input-box"
                                isRequired
                                onKeyDown={handleOnKeyDown}
                                onChange={handleMarkupDiscountChange}
                                placeholder={'0'}
                                style={costCalcStyles.inputField}
                                type="text"
                                validated={validated}
                                value={markup}
                              />
                            </InputGroupItem>
                            <InputGroupText style={costCalcStyles.percent}>
                              {intl.formatMessage(messages.percentSymbol)}
                            </InputGroupText>
                          </InputGroup>
                          {validated === 'error' && (
                            <HelperText>
                              <HelperTextItem variant="error">{intl.formatMessage(helpText)}</HelperTextItem>
                            </HelperText>
                          )}
                        </FormGroup>
                      </Form>
                    </FlexItem>
                  </Flex>
                </Flex>
              </StackItem>
              <StackItem>
                <div style={costCalcStyles.exampleMargin}>
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
        }}
      </CostModelContext.Consumer>
    );
  }
}

const mapStateToProps = createMapStateToProps<undefined, MarkupWithDistributionStateProps>(() => {
  return {
    // TBD...
  };
});

const MarkupWithDistribution = injectIntl(connect(mapStateToProps, {})(MarkupWithDistributionBase));

export default MarkupWithDistribution;
