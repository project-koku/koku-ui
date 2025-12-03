import messages from '@koku-ui/i18n/locales/messages';
import { Checkbox, Content, FormGroup, Radio, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { Form } from '../components/forms/form';
import { CostModelContext } from './context';
import { styles } from './wizard.styles';

interface DistributionOwnProps extends WrappedComponentProps {
  // TBD...
}

interface DistributionStateProps {
  // TBD...
}

type DistributionProps = DistributionOwnProps & DistributionStateProps;

class DistributionBase extends React.Component<DistributionProps, DistributionStateProps> {
  public render() {
    const { intl } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          handleDistributionChange,
          handleDistributeNetworkChange,
          handleDistributePlatformUnallocatedChange,
          handleDistributeStorageChange,
          handleDistributeWorkerUnallocatedChange,
          distribution,
          distributeNetwork,
          distributePlatformUnallocated,
          distributeStorage,
          distributeWorkerUnallocated,
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size={TitleSizes.xl} style={styles.titleWithLearnMore}>
                  {intl.formatMessage(messages.costDistribution)}
                </Title>
                <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.learnMore)}
                </a>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size={TitleSizes.md}>
                  {intl.formatMessage(messages.distributionType)}
                </Title>
                <Content>
                  <Content component="p" style={styles.cardDescription}>
                    {intl.formatMessage(messages.distributionModelDesc)}
                  </Content>
                </Content>
              </StackItem>
              <StackItem>
                <Form>
                  <FormGroup isInline fieldId="distribution-type" isRequired>
                    <Radio
                      isChecked={distribution === 'cpu'}
                      name="distribution-type"
                      label={intl.formatMessage(messages.cpuTitle)}
                      aria-label={intl.formatMessage(messages.cpuTitle)}
                      id="cpu-distribution"
                      value="cpu"
                      onChange={handleDistributionChange}
                    />
                    <Radio
                      isChecked={distribution === 'memory'}
                      name="distribution-type"
                      label={intl.formatMessage(messages.memoryTitle)}
                      aria-label={intl.formatMessage(messages.memoryTitle)}
                      id="memory-distribution"
                      value="memory"
                      onChange={handleDistributionChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size={TitleSizes.md}>
                  {intl.formatMessage(messages.distributeCostsToProjects)}
                </Title>
              </StackItem>
              <StackItem>
                <Form>
                  <FormGroup fieldId="distribute-unallocated-costs" isRequired>
                    <Checkbox
                      aria-label={intl.formatMessage(messages.distributePlatform)}
                      id="distribute-platform"
                      isChecked={distributePlatformUnallocated}
                      label={intl.formatMessage(messages.distributePlatform)}
                      onChange={handleDistributePlatformUnallocatedChange}
                    />
                    <Checkbox
                      aria-label={intl.formatMessage(messages.distributeWorker)}
                      id="distribute-worker"
                      isChecked={distributeWorkerUnallocated}
                      label={intl.formatMessage(messages.distributeWorker)}
                      onChange={handleDistributeWorkerUnallocatedChange}
                    />
                    <Checkbox
                      aria-label={intl.formatMessage(messages.distributeNetwork)}
                      id="distribute-network"
                      isChecked={distributeNetwork}
                      label={intl.formatMessage(messages.distributeNetwork)}
                      onChange={handleDistributeNetworkChange}
                    />
                    <Checkbox
                      aria-label={intl.formatMessage(messages.distributeStorage)}
                      id="distribute-storage"
                      isChecked={distributeStorage}
                      label={intl.formatMessage(messages.distributeStorage)}
                      onChange={handleDistributeStorageChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

const mapStateToProps = createMapStateToProps<undefined, DistributionStateProps>(() => {
  return {
    // TBD...
  };
});

const Distribution = injectIntl(connect(mapStateToProps, {})(DistributionBase));

export default Distribution;
