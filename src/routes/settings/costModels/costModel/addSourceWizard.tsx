import {
  Alert,
  Button,
  Grid,
  GridItem,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { parseApiError } from 'routes/settings/costModels/costModelWizard/parseError';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import AddSourceStep from './addSourceStep';

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

const sourceTypeMap = {
  'OpenShift Container Platform': 'OCP',
  'Microsoft Azure': 'Azure',
  'Amazon Web Services': 'AWS',
};

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
    const sourceType = sourceTypeMap[source_type];
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
      <Modal
        isOpen={isOpen}
        title={intl.formatMessage(messages.costModelsAssignSources, { count: 2 })}
        onClose={onClose}
        variant="large"
        actions={[
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
          </Button>,
          <Button key="cancel" variant="link" isDisabled={isUpdateInProgress} onClick={onClose}>
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        <Stack>
          <StackItem>{updateApiError && <Alert variant="danger" title={`${updateApiError}`} />}</StackItem>
          <StackItem>
            <Grid>
              <GridItem span={2}>
                <TextContent>
                  <Text component={TextVariants.p}>{intl.formatMessage(messages.names, { count: 1 })}</Text>
                </TextContent>
              </GridItem>
              <GridItem span={10}>
                <TextContent>
                  <Text component={TextVariants.p}>{this.props.costModel.name}</Text>
                </TextContent>
              </GridItem>
              <GridItem span={2}>
                <TextContent>
                  <Text component={TextVariants.p}>{intl.formatMessage(messages.sourceType)}</Text>
                </TextContent>
              </GridItem>
              <GridItem span={10}>
                <TextContent>
                  <Text component={TextVariants.p}>{this.props.costModel.source_type}</Text>
                </TextContent>
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
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
      </Modal>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
