import type { CostModel } from '@koku-ui/api/costModels';
import type { Provider } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Button,
  Content,
  ContentVariants,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { FetchStatus } from '../../../../store/common';
import { createMapStateToProps } from '../../../../store/common';
import { costModelsSelectors } from '../../../../store/costModels';
import { sourcesActions, sourcesSelectors } from '../../../../store/sourceSettings';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { parseApiError } from '../costModelWizard/parseError';
import AddSourceStep from './addSourceStep';
import { styles } from './costModelInfo.styles';
import { getSourceType } from './utils/sourceType';

interface AddSourceWizardOwnProps extends RouterComponentProps {
  assigned?: Provider[];
  costModel?: CostModel;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (sources_uuid: string[]) => void;
}

interface AddSourceWizardStateProps {
  fetchingSourcesError?: string;
  pagination?: { page: number; perPage: number; count: number };
  isLoadingSources?: boolean;
  isUpdateInProgress?: boolean;
  providers?: Provider[];
  query?: any;
  updateApiError?: string;
}

interface AddSourceWizardDispatchProps {
  fetch: typeof sourcesActions.fetchSources;
}

interface AddSourcesStepState {
  checked: { [uuid: string]: { disabled?: boolean; selected: boolean; meta: Provider } };
}

type AddSourceWizardProps = AddSourceWizardOwnProps &
  AddSourceWizardStateProps &
  AddSourceWizardDispatchProps &
  WrappedComponentProps;

class AddSourceWizardBase extends React.Component<AddSourceWizardProps, AddSourcesStepState> {
  protected defaultState: AddSourcesStepState = {
    checked: {},
  };
  public state: AddSourcesStepState = { ...this.defaultState };

  public componentDidMount() {
    const { assigned } = this.props;

    const {
      costModel: { source_type },
      fetch,
    } = this.props;
    const sourceType = getSourceType(source_type) ?? '';
    fetch(`type=${sourceType}&limit=10&offset=0`);

    const checked = {};
    for (const cur of assigned) {
      checked[cur.uuid] = { selected: true, meta: cur, disabled: false };
    }
    this.setState({ checked });
  }

  private hasSelections = () => {
    const { checked } = this.state;
    let result = false;

    for (const item of Object.keys(checked)) {
      if (checked[item].selected && !checked[item].disabled) {
        result = true;
        break;
      }
    }
    return result;
  };

  public render() {
    const { intl, isUpdateInProgress, onClose, isOpen, onSave, costModel, updateApiError } = this.props;

    return (
      <Modal isOpen={isOpen} onClose={onClose} variant={ModalVariant.large}>
        <ModalHeader title={intl.formatMessage(messages.costModelsAssignSources, { count: 2 })} />
        <ModalBody>
          <Stack>
            <StackItem>{updateApiError && <Alert variant="danger" title={`${updateApiError}`} />}</StackItem>
            <StackItem>
              <Grid>
                <GridItem span={2}>
                  <Content>
                    <Content component={ContentVariants.p}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
                  </Content>
                </GridItem>
                <GridItem span={10}>
                  <Content>
                    <Content component={ContentVariants.p}>{this.props.costModel.name}</Content>
                  </Content>
                </GridItem>
                <GridItem span={2}>
                  <Content>
                    <Content component={ContentVariants.p}>{intl.formatMessage(messages.sourceType)}</Content>
                  </Content>
                </GridItem>
                <GridItem span={10}>
                  <Content>
                    <Content component={ContentVariants.p}>{this.props.costModel.source_type}</Content>
                  </Content>
                </GridItem>
              </Grid>
            </StackItem>
            <StackItem style={styles.addSourceStep}>
              <AddSourceStep
                fetch={this.props.fetch}
                fetchingSourcesError={this.props.fetchingSourcesError}
                isLoadingSources={this.props.isLoadingSources}
                providers={this.props.providers}
                pagination={this.props.pagination}
                query={this.props.query}
                costModel={costModel}
                checked={this.state.checked}
                setState={newState => {
                  this.setState({ checked: newState });
                }}
              />
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            key="save"
            isDisabled={
              !this.hasSelections() ||
              isUpdateInProgress ||
              this.props.isLoadingSources ||
              this.props.fetchingSourcesError !== null
            }
            onClick={() => {
              onSave(Object.keys(this.state.checked).filter(uuid => this.state.checked[uuid].selected));
            }}
          >
            {intl.formatMessage(messages.costModelsAssignSourcesParen)}
          </Button>
          <Button key="cancel" variant="link" isDisabled={isUpdateInProgress} onClick={onClose}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<AddSourceWizardProps, AddSourceWizardStateProps>(state => {
  return {
    fetchingSourcesError: sourcesSelectors.error(state) ? parseApiError(sourcesSelectors.error(state)) : null,
    isLoadingSources: sourcesSelectors.status(state) === FetchStatus.inProgress,
    isUpdateInProgress: costModelsSelectors.updateProcessing(state),
    pagination: sourcesSelectors.pagination(state),
    providers: sourcesSelectors.sources(state),
    query: sourcesSelectors.query(state),
    updateApiError: costModelsSelectors.updateError(state),
  };
});

const mapDispatchToProps: AddSourceWizardDispatchProps = {
  fetch: sourcesActions.fetchSources,
};

const AddSourceWizard = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(AddSourceWizardBase)));

export default AddSourceWizard;
