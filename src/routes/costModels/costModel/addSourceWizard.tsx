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
import { parseApiError } from 'routes/costModels/costModelWizard/parseError';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';

import AddSourceStep from './addSourceStep';

interface AddSourcesStepState {
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
}

interface Props extends WrappedComponentProps {
  assigned?: Provider[];
  onClose: () => void;
  onSave: (sources_uuid: string[]) => void;
  isOpen: boolean;
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
  providers: Provider[];
  isLoadingSources: boolean;
  isUpdateInProgress: boolean;
  fetchingSourcesError: string;
  query: { name: string; type: string; offset: string; limit: string };
  pagination: { page: number; perPage: number; count: number };
  updateApiError: string;
}

const sourceTypeMap = {
  'OpenShift Container Platform': 'OCP',
  'Microsoft Azure': 'Azure',
  'Amazon Web Services': 'AWS',
};

class AddSourceWizardBase extends React.Component<Props, AddSourcesStepState> {
  public state = { checked: {} };

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
          <StackItem>{Boolean(updateApiError) && <Alert variant="danger" title={`${updateApiError}`} />}</StackItem>
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
                  <Text component={TextVariants.p}>{intl.formatMessage(messages.costModelsSourceType)}</Text>
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

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        pagination: sourcesSelectors.pagination(state),
        query: sourcesSelectors.query(state),
        providers: sourcesSelectors.sources(state),
        isLoadingSources: sourcesSelectors.status(state) === FetchStatus.inProgress,
        isUpdateInProgress: costModelsSelectors.updateProcessing(state),
        updateApiError: costModelsSelectors.updateError(state),
        fetchingSourcesError: sourcesSelectors.error(state) ? parseApiError(sourcesSelectors.error(state)) : null,
      };
    }),
    {
      fetch: sourcesActions.fetchSources,
    }
  )(AddSourceWizardBase)
);
