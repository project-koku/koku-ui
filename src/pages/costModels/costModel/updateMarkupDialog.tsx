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
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { formatValue } from 'utils/formatValue';

import { styles } from './costCalc.styles';

interface Props extends WithTranslation {
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
        (formatValue(Number(noSignValue), 'markup', {
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
    const { error, current, onClose, updateCostModel, isLoading, t } = this.props;
    const { isDiscount } = this.state;
    return (
      <Modal
        title={t('cost_models_details.edit_markup_or_discount')}
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
            {t('save')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {t('cancel')}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
          <StackItem>
            <TextContent>
              <Text style={styles.cardDescription}>
                {t('cost_models_details.description_markup_or_discount_model')}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Title headingLevel="h6" size="md">
                {t('cost_models_details.markup_or_discount')}
              </Title>
            </TextContent>
            <Form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <Flex>
                <Flex direction={{ default: 'column' }}>
                  <FormGroup fieldId="markup-or-discount">
                    <FlexItem style={styles.marginTopSix}>
                      <Radio
                        isChecked={!isDiscount}
                        name="discount"
                        label={t('cost_models_details.markup_plus')}
                        aria-label={t('cost_models_details.markup_plus')}
                        id="markup"
                        value="false" // "+"
                        onChange={this.handleSignChange}
                      />
                    </FlexItem>
                    <FlexItem style={styles.marginTopSix}>
                      <Radio
                        isChecked={isDiscount}
                        name="discount"
                        label={t('cost_models_details.discount_minus')}
                        aria-label={t('cost_models_details.discount_minus')}
                        id="discount"
                        value="true" // '-'
                        onChange={this.handleSignChange}
                      />
                    </FlexItem>
                  </FormGroup>
                </Flex>
                <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                  <FormGroup fieldId="rate" helperTextInvalid={t('cost_models_wizard.markup.invalid_markup_text')}>
                    <FlexItem style={styles.marginTopSix}>
                      <InputGroup>
                        <InputGroupText style={styles.sign}>{isDiscount ? '-' : '+'}</InputGroupText>
                        <TextInput
                          style={styles.inputField}
                          type="text"
                          aria-label={t('rate')}
                          id="markup-input-box"
                          value={this.state.markup}
                          onKeyDown={this.handleOnKeyDown}
                          onChange={this.handleMarkupDiscountChange}
                          validated={this.markupValidator()}
                        />
                        <InputGroupText style={styles.percent}>%</InputGroupText>
                      </InputGroup>
                    </FlexItem>
                  </FormGroup>
                </Flex>
              </Flex>
            </Form>
          </StackItem>
          <StackItem />
          <StackItem>
            <TextContent>
              <Title headingLevel="h6" size="md">
                {t('cost_models_details.examples.title')}
              </Title>
            </TextContent>
            <List>
              <ListItem>{t('cost_models_details.examples.noAdjustment')}</ListItem>
              <ListItem>{t('cost_models_details.examples.doubleMarkup')}</ListItem>
              <ListItem>{t('cost_models_details.examples.reduceBaseToZero')}</ListItem>
              <ListItem>{t('cost_models_details.examples.reduceBaseToSeventyFive')}</ListItem>
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

export default connect(
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
)(withTranslation()(UpdateMarkupModelBase));
