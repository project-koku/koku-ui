import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Divider,
  ExpandableSection,
  Grid,
  GridItem,
  Icon,
  Label,
  List,
  ListItem,
  PageSection,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/add-circle-o-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { OpenShiftIcon } from 'routes/components/icons/openShiftIcon';
import { getReleasePath } from 'utils/paths';

import { styles } from './noProviders.styles';

const NoProviders = () => {
  const intl = useIntl();

  const getCloudCard = () => {
    return (
      <Card style={styles.card}>
        <CardTitle>
          <div style={styles.cardTitle}>
            <Icon size="lg" style={styles.cardTitleIcon}>
              <AddCircleOIcon />
            </Icon>
            {intl.formatMessage(messages.noProvidersCloudCost)}
          </div>
        </CardTitle>
        <CardBody>
          {intl.formatMessage(messages.noProvidersCloudCostDesc)}
          <div style={styles.cardBodyItem}>
            <Button
              component="a"
              href={intl.formatMessage(messages.docsIntegrations)}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              {intl.formatMessage(messages.noProvidersCloudIntegration)}
            </Button>
          </div>
          <div style={styles.cardBodyItem}>
            <ExpandableSection toggleText={intl.formatMessage(messages.noProvidersCloudIntegrationHelp)}>
              {intl.formatMessage(messages.noProvidersCloudIntegrationHelpDesc)}
              <List style={styles.cardBodyItem}>
                <ListItem>
                  <a href={intl.formatMessage(messages.docsIntegrationsAws)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.noProvidersCloudIntegrationHelpAws)}
                  </a>
                </ListItem>
                <ListItem>
                  <a href={intl.formatMessage(messages.docsIntegrationsGcp)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.noProvidersCloudIntegrationHelpGcp)}
                  </a>
                </ListItem>
                <ListItem>
                  <a href={intl.formatMessage(messages.docsIntegrationsAzure)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.noProvidersCloudIntegrationHelpAzure)}
                  </a>
                </ListItem>
              </List>
            </ExpandableSection>
          </div>
        </CardBody>
      </Card>
    );
  };

  const getHeaderTitle = () => {
    return (
      <div>
        <div style={styles.headerDesc}>
          {intl.formatMessage(messages.noProvidersDesc, {
            ocp: <b>{intl.formatMessage(messages.ocp)}</b>,
            aws: <b>{intl.formatMessage(messages.awsAlt)}</b>,
            gcp: <b>{intl.formatMessage(messages.gcp)}</b>,
            azure: <b>{intl.formatMessage(messages.azure)}</b>,
          })}
        </div>
        <div style={styles.headerLink}>
          <Button
            component="a"
            href={intl.formatMessage(messages.docsCostManagement)}
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
            rel="noreferrer"
            target="_blank"
            variant="link"
          >
            {intl.formatMessage(messages.costManagementDocs)}
          </Button>
        </div>
      </div>
    );
  };

  const getLearningResources = () => {
    const release = getReleasePath();

    return (
      <Button variant="link" component="a" href={`${release}/openshift/learning-resources`}>
        {intl.formatMessage(messages.viewLearningResources)}
      </Button>
    );
  };

  const getOcpCard = () => {
    return (
      <Card style={styles.card}>
        <CardTitle>
          <div style={styles.cardTitle}>
            <Icon size="lg" style={styles.cardTitleIcon}>
              <AddCircleOIcon />
            </Icon>
            {intl.formatMessage(messages.noProvidersOcpCost)}
          </div>
        </CardTitle>
        <CardBody>
          {intl.formatMessage(messages.noProvidersOcpCostDesc)}
          <div style={styles.cardBodyItem}>
            <Button
              component="a"
              href={intl.formatMessage(messages.docsMetricsOperator)}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              {intl.formatMessage(messages.noProvidersMetricsOperator)}
            </Button>
          </div>
          <div style={styles.cardBodyItem}>
            {intl.formatMessage(messages.noProvidersOcpCli, {
              cli: <b>{intl.formatMessage(messages.ocpCli)}</b>,
              link: (
                <a href={intl.formatMessage(messages.docsOcpCli)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.noProvidersOcpCliLink)}
                </a>
              ),
            })}
          </div>
        </CardBody>
      </Card>
    );
  };

  const getRecommended = () => {
    return (
      <DataList aria-label={intl.formatMessage(messages.noProvidersRecommended)} isCompact>
        <DataListItem aria-labelledby="accomplish1">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="accomplish1" style={styles.recommendedCol1} width={5}>
                  <span id="sm-grid-item1">{intl.formatMessage(messages.noProvidersRecommendedAccomplish)}</span>
                </DataListCell>,
                <DataListCell key="accomplish2" style={styles.recommendedCol2} width={1}>
                  <Label color="orange">{intl.formatMessage(messages.documentation)}</Label>
                </DataListCell>,
                <DataListCell key="accomplish3" style={styles.recommendedCol3}>
                  <Button
                    component="a"
                    href={intl.formatMessage(messages.docsAccomplish)}
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    rel="noreferrer"
                    target="_blank"
                    variant="link"
                  >
                    {intl.formatMessage(messages.viewDocumentation)}
                  </Button>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem aria-labelledby="koku1">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="koku1" style={styles.recommendedCol1} width={5}>
                  {intl.formatMessage(messages.projectKoku)}
                </DataListCell>,
                <DataListCell key="koku2" style={styles.recommendedCol2} width={1} />,
                <DataListCell key="koku3" style={styles.recommendedCol3}>
                  <Button
                    component="a"
                    href={intl.formatMessage(messages.docsKokuMetricsOperator)}
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    rel="noreferrer"
                    target="_blank"
                    variant="link"
                  >
                    {intl.formatMessage(messages.kokuMetricsOperator)}
                  </Button>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem aria-labelledby="releases1">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="releases1" style={styles.recommendedCol1} width={5}>
                  {intl.formatMessage(messages.releaseNotes)}
                </DataListCell>,
                <DataListCell key="releases2" style={styles.recommendedCol2} width={1}>
                  <Label color="purple">{intl.formatMessage(messages.releaseNotes)}</Label>
                </DataListCell>,
                <DataListCell key="releases3" style={styles.recommendedCol3}>
                  <Button
                    component="a"
                    href={intl.formatMessage(messages.docsReleases)}
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    rel="noreferrer"
                    target="_blank"
                    variant="link"
                  >
                    {intl.formatMessage(messages.viewReleaseNotes)}
                  </Button>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      </DataList>
    );
  };

  const getTroubleshooting = () => {
    return (
      <Card style={styles.troubleshooting}>
        <CardBody style={styles.troubleshootingDesc}>
          {intl.formatMessage(messages.noProvidersTroubleshooting)}
          <a href={intl.formatMessage(messages.docsTroubleshooting)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.learnMore)}
          </a>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <PageHeader title={intl.formatMessage(messages.costManagement)}>
        <div style={styles.header}>
          <OpenShiftIcon />
          <Divider orientation={{ default: 'vertical' }} style={styles.divider} />
          {getHeaderTitle()}
        </div>
      </PageHeader>
      <PageSection style={styles.getStartedContainer}>
        <Stack>
          <StackItem style={styles.getStarted}>
            <Title headingLevel="h3" size={TitleSizes.md}>
              {intl.formatMessage(messages.noProvidersGetStarted)}
            </Title>
          </StackItem>
          <StackItem>
            <Grid hasGutter>
              <GridItem sm={12} lg={6}>
                {getOcpCard()}
              </GridItem>
              <GridItem sm={12} lg={6}>
                {getCloudCard()}
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>{getTroubleshooting()}</StackItem>
          <StackItem style={styles.recommended}>
            <Title headingLevel="h3" size={TitleSizes.md}>
              {intl.formatMessage(messages.noProvidersRecommended)}
            </Title>
          </StackItem>
          <StackItem style={styles.recommended}>{getRecommended()}</StackItem>
          <StackItem style={styles.resources}>{getLearningResources()}</StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default NoProviders;
