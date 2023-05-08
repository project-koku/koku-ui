import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { countDecimals, formatPercentageMarkup, isPercentageFormatValid, unFormat } from 'utils/format';

import { styles } from './costCalc.styles';

interface UpdateMarkupDialogOwnProps extends WrappedComponentProps {
  current?: CostModel;
}

interface UpdateMarkupDialogStateProps {
  error?: string;
  isLoading?: boolean;
}

interface UpdateRateModalDispatchProps {
  onClose?: typeof costModelsActions.setCostModelDialog;
  updateCostModel?: typeof costModelsActions.updateCostModel;
}

interface UpdateMarkupDialogState {
  isDiscount?: boolean;
  markup?: string;
}

type UpdateMarkupDialogProps = UpdateMarkupDialogOwnProps & UpdateMarkupDialogStateProps & UpdateRateModalDispatchProps;

class UpdateMarkupDialogBase extends React.Component<UpdateMarkupDialogProps, UpdateMarkupDialogState> {
  constructor(props) {
    super(props);
    const initialMarkup = Number(this.props.current.markup.value || 0); // Drop trailing zeros from API value
    const isNegative = initialMarkup < 0;
    const markupValue = isNegative ? initialMarkup.toString().substring(1) : initialMarkup.toString();

    this.state = {
      isDiscount: isNegative,
      markup: formatPercentageMarkup(Number(markupValue)),
    };
  }

  private handleSignChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ isDiscount: value === 'true' });
  };

  private handleMarkupDiscountChange = (_, event) => {
    const { value } = event.currentTarget;

    this.setState({ markup: value });
  };

  private handleOnKeyDown = event => {
    // Prevent 'enter', '+', and '-'
    if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
      event.preventDefault();
    }
  };

  private markupValidator = () => {
    const { markup } = this.state;

    if (!isPercentageFormatValid(markup)) {
      return messages.markupOrDiscountNumber;
    }
    // Test number of decimals
    const decimals = countDecimals(markup);
    if (decimals > 10) {
      return messages.markupOrDiscountTooLong;
    }
    return undefined;
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
    const { isDiscount } = this.state;

    const helpText = this.markupValidator();
    const validated = helpText ? 'error' : 'default';
    const markup = `${isDiscount ? '-' : ''}${unFormat(this.state.markup)}`;

    return (
      <Modal
        title={intl.formatMessage(messages.editMarkupOrDiscount)}
        isOpen
        onClose={() => onClose({ name: 'updateMarkup', isOpen: false })}
        variant={ModalVariant.medium}
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const newState = {
                ...current,
                source_uuids: current.sources.map(provider => provider.uuid),
                source_type: current.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
                markup: {
                  value: markup,
                  unit: 'percent',
                },
              };
              updateCostModel(current.uuid, newState, 'updateMarkup');
            }}
            isDisabled={
              isLoading ||
              validated === 'error' ||
              markup.trim().length === 0 ||
              Number(markup) === Number(current.markup.value)
            }
          >
            {intl.formatMessage(messages.save)}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
          <StackItem>
            <TextContent>
              <Text style={styles.cardDescription}>{intl.formatMessage(messages.markupOrDiscountModalDesc)}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Title headingLevel="h2" size={TitleSizes.md}>
                {intl.formatMessage(messages.markupOrDiscount)}
              </Title>
            </TextContent>
            <Flex style={styles.markupRadioContainer}>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <Radio
                    isChecked={!isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.markupPlus)}
                    aria-label={intl.formatMessage(messages.markupPlus)}
                    id="markup"
                    value="false" // "+"
                    onChange={this.handleSignChange}
                    style={styles.markupRadio}
                  />
                  <Radio
                    isChecked={isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.discountMinus)}
                    aria-label={intl.formatMessage(messages.discountMinus)}
                    id="discount"
                    value="true" // '-'
                    onChange={this.handleSignChange}
                  />
                </FlexItem>
              </Flex>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <Form>
                    <FormGroup
                      fieldId="markup-input-box"
                      helperTextInvalid={helpText ? intl.formatMessage(helpText) : undefined}
                      style={styles.rateContainer}
                      validated={validated}
                    >
                      <InputGroup>
                        <InputGroupText style={styles.sign}>
                          {isDiscount
                            ? intl.formatMessage(messages.discountMinus)
                            : intl.formatMessage(messages.markupPlus)}
                        </InputGroupText>
                        <TextInput
                          aria-label={intl.formatMessage(messages.rate)}
                          id="markup-input-box"
                          isRequired
                          onKeyDown={this.handleOnKeyDown}
                          onChange={this.handleMarkupDiscountChange}
                          placeholder={'0'}
                          style={styles.inputField}
                          type="text"
                          validated={validated}
                          value={this.state.markup}
                        />
                        <InputGroupText style={styles.percent}>
                          {intl.formatMessage(messages.percentSymbol)}
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </FlexItem>
              </Flex>
            </Flex>
          </StackItem>
          <StackItem />
          <StackItem>
            <TextContent>
              <Title headingLevel="h3" size={TitleSizes.md}>
                {intl.formatMessage(messages.examplesTitle)}
              </Title>
            </TextContent>
            <List>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesNoAdjust)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesDoubleMarkup)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceZero)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceSeventyfive)}</ListItem>
            </List>
          </StackItem>
        </Stack>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<UpdateMarkupDialogOwnProps, UpdateMarkupDialogStateProps>(state => {
  return {
    isLoading: costModelsSelectors.updateProcessing(state),
    error: costModelsSelectors.updateError(state),
  };
});

const mapDispatchToProps: UpdateRateModalDispatchProps = {
  onClose: costModelsActions.setCostModelDialog,
  updateCostModel: costModelsActions.updateCostModel,
};

const UpdateMarkupDialog = injectIntl(connect(mapStateToProps, mapDispatchToProps)(UpdateMarkupDialogBase));

export default UpdateMarkupDialog;
