import {
  Alert,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { formatValue } from 'utils/formatValue';

interface Props extends InjectedTranslateProps {
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  current: CostModel;
}

interface State {
  markup: string;
}

class UpdateMarkupModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      markup:
        (formatValue(Number(this.props.current.markup.value), 'markup', {
          fractionDigits: 2,
        }) as string) || '0.00',
    };
  }
  public render() {
    const { error, current, onClose, updateCostModel, isLoading, t } = this.props;
    return (
      <Modal
        title={t('cost_models_details.edit_markup')}
        isOpen
        onClose={() => onClose({ name: 'updateMarkup', isOpen: false })}
        variant="small"
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
                  value: this.state.markup,
                  unit: 'percent',
                },
              };
              updateCostModel(current.uuid, newState, 'updateMarkup');
            }}
            isDisabled={
              isNaN(Number(this.state.markup)) ||
              Number(this.state.markup) === Number(current.markup.value || 0) ||
              isLoading
            }
          >
            {t('cost_models_details.add_rate_modal.save')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
          <StackItem>
            <Title headingLevel="h2" size="md">
              {t('cost_models_details.table.columns.name')}
            </Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h6}>{current.name}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Form>
              <FormGroup
                label={t('cost_models_wizard.markup.markup_label')}
                fieldId="markup-input-box"
                helperTextInvalid={t('cost_models_wizard.markup.invalid_markup_text')}
                validated={!isNaN(Number(this.state.markup)) ? 'default' : 'error'}
              >
                <InputGroup style={{ width: '150px' }}>
                  <TextInput
                    type="text"
                    aria-label={t('cost_models_wizard.markup.markup_label')}
                    id="markup-input-box"
                    value={this.state.markup}
                    onChange={(markup: string) => {
                      const markupDecimal = Number(markup);
                      const dx = markup.split('').findIndex(c => c === '.');
                      if (!isNaN(markupDecimal) && dx > -1 && markup.length - dx - 1 > 2) {
                        this.setState({
                          markup: formatValue(markupDecimal, 'markup', {
                            fractionDigits: 2,
                          }) as string,
                        });
                        return;
                      }
                      this.setState({ markup });
                    }}
                    validated={!isNaN(Number(this.state.markup)) ? 'default' : 'error'}
                  />
                  <InputGroupText style={{ borderLeft: '0' }}>%</InputGroupText>
                </InputGroup>
              </FormGroup>
            </Form>
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
)(translate()(UpdateMarkupModelBase));
