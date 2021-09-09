import {
  Alert,
  Button,
  Flex,
  FlexItem,
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
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { formatValue } from 'utils/valueFormatter';

import { styles } from './costCalc.styles';

interface Props extends WrappedComponentProps {
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  current: CostModel;
}

interface State {
  markup: string;
  origIsDiscount: boolean;
  isDiscount: boolean;
}

class UpdateMarkupModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const initialMarkup = this.props.current.markup.value;
    const isNegative = Number(initialMarkup) < 0;
    const noSignValue = isNegative ? initialMarkup.substring(1) : initialMarkup;

    this.state = {
      markup:
        (formatValue(Number(noSignValue), 'unknown', {
          fractionDigits: 2,
        }) as string) || '0.00',
      origIsDiscount: isNegative,
      isDiscount: isNegative,
    };
  }

  private handleSignChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ isDiscount: value === 'true' });
  };

  private handleMarkupDiscountChange = (_, event) => {
    const { value } = event.currentTarget;
    const regex = /^[0-9.]*$/;
    if (regex.test(value)) {
      this.setState({ markup: value });
    }
  };

  private markupValidator = () => {
    return /^\d*(\.?\d{1,2})?$/.test(this.state.markup) ? 'default' : 'error';
  };

  private handleOnKeyDown = event => {
    // Prevent 'enter', '+', and '-'
    if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
      event.preventDefault();
    }
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
    const { isDiscount } = this.state;
    return (
      <Modal
        title={intl.formatMessage(messages.EditMarkupOrDiscount)}
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
                  value: this.state.isDiscount ? '-' + this.state.markup : this.state.markup,
                  unit: 'percent',
                },
              };
              updateCostModel(current.uuid, newState, 'updateMarkup');
            }}
            isDisabled={
              isNaN(Number(this.state.markup)) ||
              (Number(this.state.markup) ===
                Number(this.state.origIsDiscount ? current.markup.value.substring(1) : current.markup.value || 0) &&
                this.state.isDiscount === this.state.origIsDiscount) ||
              isLoading
            }
          >
            {intl.formatMessage(messages.Save)}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {intl.formatMessage(messages.Cancel)}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
          <StackItem>
            <TextContent>
              <Text style={styles.cardDescription}>{intl.formatMessage(messages.MarkupOrDiscountModalDesc)}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Title headingLevel="h2" size="md">
                {intl.formatMessage(messages.MarkupOrDiscount)}
              </Title>
            </TextContent>
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
                    onChange={this.handleSignChange}
                    style={styles.markupRadio}
                  />
                  <Radio
                    isChecked={isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.DiscountMinus)}
                    aria-label={intl.formatMessage(messages.DiscountMinus)}
                    id="discount"
                    value="true" // '-'
                    onChange={this.handleSignChange}
                  />
                </FlexItem>
              </Flex>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <InputGroup style={styles.rateContainer}>
                    <InputGroupText style={styles.sign}>{isDiscount ? '-' : '+'}</InputGroupText>
                    <TextInput
                      style={styles.inputField}
                      type="text"
                      aria-label={intl.formatMessage(messages.Rate)}
                      id="markup-input-box"
                      value={this.state.markup}
                      onKeyDown={this.handleOnKeyDown}
                      onChange={this.handleMarkupDiscountChange}
                      validated={this.markupValidator()}
                    />
                    <InputGroupText style={styles.percent}>%</InputGroupText>
                  </InputGroup>
                </FlexItem>
              </Flex>
            </Flex>
          </StackItem>
          <StackItem />
          <StackItem>
            <TextContent>
              <Title headingLevel="h3" size="md">
                {intl.formatMessage(messages.ExamplesTitle)}
              </Title>
            </TextContent>
            <List>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesNoAdjust)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesDoubleMarkup)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceZero)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceSeventyfive)}</ListItem>
            </List>
          </StackItem>
        </Stack>
      </Modal>
    );
  }
}

// Fixes issue with Typescript:
// https://github.com/microsoft/TypeScript/issues/25103#issuecomment-412806226
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
};

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        isLoading: costModelsSelectors.updateProcessing(state),
        error: costModelsSelectors.updateError(state),
      };
    }),
    {
      onClose: costModelsActions.setCostModelDialog,
      updateCostModel: costModelsActions.updateCostModel,
    },
    mergeProps
  )(UpdateMarkupModelBase)
);
