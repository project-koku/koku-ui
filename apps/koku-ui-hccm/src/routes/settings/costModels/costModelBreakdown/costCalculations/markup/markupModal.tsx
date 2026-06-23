import {
  Alert,
  Button,
  Content,
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { type CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import { parseApiError } from 'routes/settings/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { countDecimals, formatPercentageMarkup, isPercentageFormatValid, unFormat } from 'utils/format';

import { styles } from './markup.styles';

interface MarkupModalOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (costModel: CostModel) => void;
}

interface MarkupModalStateProps {
  costModelsUpdateError: AxiosError;
  costModelsUpdateStatus: FetchStatus;
}

type MarkupModalProps = MarkupModalOwnProps;

const MarkupModal: React.FC<MarkupModalProps> = ({
  canWrite,
  costModel,
  isDispatch = true,
  isOpen,
  onClose,
  onSave,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const initialMarkup = Number(costModel?.markup?.value ?? 0); // Drop trailing zeros from API value
  const isNegative = initialMarkup < 0;
  const markupValue = isNegative ? initialMarkup.toString().substring(1) : initialMarkup.toString();

  const [isDiscount, setIsDiscount] = useState(isNegative);
  const [isFinish, setIsFinish] = useState(false);
  const [markup, setMarkup] = useState(formatPercentageMarkup(Number(markupValue)));
  const [payload, setPayload] = useState<CostModel>();

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnKeyDown = event => {
    // Prevent 'enter', '+', and '-'
    if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
      event.preventDefault();
    }
  };

  const handleOnMarkupDiscountChange = event => {
    const { value } = event.currentTarget;
    setMarkup(value);
  };

  const handleOnSave = () => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      const items = {
        ...costModel,
        markup: {
          value: unFormat(markupOrDiscount),
          unit: 'percent',
        },
        source_type: getSourceType(costModel?.source_type),
        source_uuids: costModel?.sources?.map(provider => provider.uuid) ?? [],
      };

      if (costModel?.uuid && isDispatch) {
        setIsFinish(true);
        setPayload(items);

        dispatch(costModelsActions.updateCostModel(costModel?.uuid, items));
      } else {
        onSave?.(items);
      }
    }
  };

  const handleOnSignChange = event => {
    const { value } = event.currentTarget;
    setIsDiscount(value === 'true');
  };

  // Validators

  const markupValidator = () => {
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

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onSave?.(payload);
      }
    }
  }, [isFinish, costModelsUpdateError, costModelsUpdateStatus, onSave, payload]);

  const helpText = markupValidator();
  const isLoading = costModelsUpdateStatus === FetchStatus.inProgress;
  const markupOrDiscount = `${isDiscount ? '-' : ''}${markup}`;
  const validated = helpText ? 'error' : 'default';

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.editMarkupOrDiscount)} />
      <ModalBody>
        <Stack hasGutter>
          <StackItem>
            {costModelsUpdateError && <Alert variant="danger" title={parseApiError(costModelsUpdateError)} />}
          </StackItem>
          <StackItem>
            <Content>
              <Content component="p" style={styles.cardDescription}>
                {intl.formatMessage(messages.markupOrDiscountModalDesc)}
              </Content>
            </Content>
          </StackItem>
          <StackItem>
            <Content>
              <Title headingLevel="h2" size={TitleSizes.md}>
                {intl.formatMessage(messages.markupOrDiscount)}
              </Title>
            </Content>
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
                    onChange={handleOnSignChange}
                    style={styles.markupRadio}
                  />
                  <Radio
                    isChecked={isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.discountMinus)}
                    aria-label={intl.formatMessage(messages.discountMinus)}
                    id="discount"
                    value="true" // '-'
                    onChange={handleOnSignChange}
                  />
                </FlexItem>
              </Flex>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <Form>
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
                            onKeyDown={handleOnKeyDown}
                            onChange={handleOnMarkupDiscountChange}
                            placeholder={'0'}
                            style={styles.inputField}
                            type="text"
                            validated={validated}
                            value={markup}
                          />
                        </InputGroupItem>
                        <InputGroupText style={styles.percent}>
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
          <StackItem />
          <StackItem>
            <Content>
              <Title headingLevel="h3" size={TitleSizes.md}>
                {intl.formatMessage(messages.examplesTitle)}
              </Title>
            </Content>
            <List>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesNoAdjust)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesDoubleMarkup)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceZero)}</ListItem>
              <ListItem>{intl.formatMessage(messages.costModelsExamplesReduceSeventyfive)}</ListItem>
            </List>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          isDisabled={
            !canWrite ||
            isLoading ||
            validated === 'error' ||
            markupOrDiscount.trim().length === 0 ||
            Number(markupOrDiscount) === Number(costModel?.markup?.value)
          }
          key="save"
          onClick={handleOnSave}
          variant="primary"
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button isDisabled={isLoading} key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): MarkupModalStateProps => {
  const costModelsUpdateError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateError(state)
  );
  const costModelsUpdateStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateStatus(state)
  );

  return {
    costModelsUpdateError,
    costModelsUpdateStatus,
  };
};

export { MarkupModal };
