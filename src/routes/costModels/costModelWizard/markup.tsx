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
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form } from 'routes/costModels/components/forms/form';
import { styles as costCalcStyles } from 'routes/costModels/costModel/costCalc.styles';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { countDecimals, isPercentageFormatValid } from 'utils/format';

import { CostModelContext } from './context';
import { styles } from './wizard.styles';

interface MarkupWithDistributionOwnProps extends WrappedComponentProps {
  // TBD...
}

interface MarkupWithDistributionStateProps {
  isCostDistributionFeatureEnabled?: boolean;
}

type MarkupWithDistributionProps = MarkupWithDistributionOwnProps & MarkupWithDistributionStateProps;

class MarkupWithDistributionBase extends React.Component<MarkupWithDistributionProps> {
  public render() {
    const { intl, isCostDistributionFeatureEnabled } = this.props;

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
                {/* Todo: Update when we get the new doc urls */}
                {isCostDistributionFeatureEnabled && (
                  <a href={intl.formatMessage(messages.docsCostModelsMarkup)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.learnMore)}
                  </a>
                )}
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.markupOrDiscount)}
                </Title>
                {intl.formatMessage(messages.markupOrDiscountModalDesc)}
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
                        <FormGroup
                          fieldId="markup-input-box"
                          helperTextInvalid={helpText ? intl.formatMessage(helpText) : undefined}
                          style={costCalcStyles.rateContainer}
                          validated={validated}
                        >
                          <InputGroup>
                            <InputGroupText style={costCalcStyles.sign}>
                              {isDiscount
                                ? intl.formatMessage(messages.discountMinus)
                                : intl.formatMessage(messages.markupPlus)}
                            </InputGroupText>
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
                            <InputGroupText style={costCalcStyles.percent}>
                              {intl.formatMessage(messages.percentSymbol)}
                            </InputGroupText>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </FlexItem>
                  </Flex>
                </Flex>
              </StackItem>
              <StackItem>
                <div style={costCalcStyles.exampleMargin}>
                  <TextContent>
                    <Text component={TextVariants.h3}>{intl.formatMessage(messages.examplesTitle)}</Text>
                  </TextContent>
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

const mapStateToProps = createMapStateToProps<undefined, MarkupWithDistributionStateProps>(state => {
  return {
    isCostDistributionFeatureEnabled: featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(state),
  };
});

const MarkupWithDistribution = injectIntl(connect(mapStateToProps, {})(MarkupWithDistributionBase));

export default MarkupWithDistribution;
