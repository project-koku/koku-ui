import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { styles } from './costCalc.styles';

interface Props extends WithTranslation {
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  current: CostModel;
}

interface State {
  distribution: string;
}

class UpdateDistributionModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      distribution: this.props.current.distribution,
    };
  }

  private handleDistributionChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ distribution: value });
  };

  public render() {
    const { error, current, onClose, updateCostModel, isLoading, t } = this.props;
    return (
      <Modal
        title={t('cost_models_details.distribution_type')}
        isOpen
        onClose={() => onClose({ name: 'updateDistribution', isOpen: false })}
        variant="small"
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const newState = {
                ...current,
                source_uuids: current.sources.map(provider => provider.uuid),
                // will always be OCP
                source_type: 'OCP',
                distribution: this.state.distribution,
              };
              updateCostModel(current.uuid, newState, 'updateDistribution');
            }}
          >
            {t('save')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateDistribution', isOpen: false })}
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
              <Text style={styles.cardDescription}>{t('cost_models_details.description_distribution_model')}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Form>
              <FormGroup isInline fieldId="cost-distribution" isRequired>
                <Radio
                  isChecked={this.state.distribution === 'cpu'}
                  name="cpuDistribution"
                  label={t('cpu_title')}
                  aria-label={t('cpu_title')}
                  id="cpuDistribution"
                  value="cpu"
                  onChange={this.handleDistributionChange}
                />
                <Radio
                  isChecked={this.state.distribution === 'memory'}
                  name="memoryDistribution"
                  label={t('memory_title')}
                  aria-label={t('memory_title')}
                  id="memoryDistribution"
                  value="memory"
                  onChange={this.handleDistributionChange}
                />
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
)(withTranslation()(UpdateDistributionModelBase));
