import { FormGroup, Radio, Stack, StackItem, Text, TextContent, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form } from 'routes/costModels/components/forms/form';
import { createMapStateToProps } from 'store/common';

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
          handleDistributePlatformUnallocatedChange,
          handleDistributeWorkerUnallocatedChange,
          distribution,
          distributePlatformUnallocated,
          distributeWorkerUnallocated,
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="xl" style={styles.titleWithLearnMore}>
                  {intl.formatMessage(messages.costDistribution)}
                </Title>
                <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.learnMore)}
                </a>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.distributionType)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.distributionModelDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-type" isRequired>
                    <Radio
                      isChecked={distribution === 'cpu'}
                      name="distributionType"
                      label={intl.formatMessage(messages.cpuTitle)}
                      aria-label={intl.formatMessage(messages.cpuTitle)}
                      id="cpuDistribution"
                      value="cpu"
                      onChange={handleDistributionChange}
                    />
                    <Radio
                      isChecked={distribution === 'memory'}
                      name="distributionType"
                      label={intl.formatMessage(messages.memoryTitle)}
                      aria-label={intl.formatMessage(messages.memoryTitle)}
                      id="memoryDistribution"
                      value="memory"
                      onChange={handleDistributionChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.platform)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.platformDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-platform-unallocated" isRequired>
                    <Radio
                      isChecked={distributePlatformUnallocated}
                      name="distributePlatformUnallocated"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distributePlatformTrue"
                      value="true"
                      onChange={handleDistributePlatformUnallocatedChange}
                    />
                    <Radio
                      isChecked={!distributePlatformUnallocated}
                      name="distributePlatformUnallocated"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distributePlatformFalse"
                      value="false"
                      onChange={handleDistributePlatformUnallocatedChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.workerUnallocated)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.workerUnallocatedDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-worker-unallocated" isRequired>
                    <Radio
                      isChecked={distributeWorkerUnallocated}
                      name="distributeWorkerUnallocated"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distributeWorkerTrue"
                      value="true"
                      onChange={handleDistributeWorkerUnallocatedChange}
                    />
                    <Radio
                      isChecked={!distributeWorkerUnallocated}
                      name="distributeWorkerUnallocated"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distributeWorkerFalse"
                      value="false"
                      onChange={handleDistributeWorkerUnallocatedChange}
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
