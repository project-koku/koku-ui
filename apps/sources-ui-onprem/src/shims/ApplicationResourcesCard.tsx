import { Card, CardBody, CardTitle, Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSource } from 'sources-ui/src/hooks/useSource';

/** Same label the settings credential form builds from the `cluster_id` field name. */
const clusterIdLabel = 'cluster_id'.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());

/** Read-only cluster identifier, in place of the Insights connected-applications form. */
const ApplicationResourcesCard = () => {
  const intl = useIntl();
  const source = useSource();

  return (
    <Card className="card pf-v6-u-m-lg pf-v6-u-mt-0">
      <CardTitle>
        {intl.formatMessage({
          id: 'sources.detailsSectionTitle',
          defaultMessage: 'Details',
        })}
      </CardTitle>
      <CardBody>
        <Form>
          <FormGroup label={clusterIdLabel} fieldId="credential-cluster_id">
            <TextInput id="credential-cluster_id" value={source?.source_ref || ''} type="text" isDisabled />
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ApplicationResourcesCard;
