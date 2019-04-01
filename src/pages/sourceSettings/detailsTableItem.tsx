import { Grid, GridItem } from '@patternfly/react-core';
import { Provider } from 'api/providers';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  source: Provider;
}

export const DetailsTableItemBase: React.SFC<Props> = ({ source, t }) => {
  switch (source.type) {
    case 'OCP':
      return (
        <>
          <Grid gutter="md">
            <GridItem md={12} lg={6}>
              <div>{t('source_details.cluster_id')}</div>
              <small>{source.authentication.provider_resource_name}</small>
            </GridItem>
            <GridItem md={12} lg={6} rowSpan={4} />
            <GridItem md={12} lg={6}>
              <div>{t('source_details.date_added')}</div>
              <small>{source.customer.date_created}</small>
            </GridItem>
            <GridItem md={12} lg={6}>
              <div>{t('source_details.added_by')}</div>
              <small>
                {source.created_by.username} ({source.created_by.email})
              </small>
            </GridItem>
            <GridItem md={12} lg={6}>
              <div>{t('source_details.currency')}</div>
              <small>USD ($)</small>
            </GridItem>
          </Grid>
        </>
      );
    case 'AWS':
      return (
        <>
          <Grid gutter="md">
            <GridItem md={12} lg={6}>
              <div>{t('source_details.arn')}</div>
              <small>{source.authentication.provider_resource_name}</small>
            </GridItem>
            <GridItem md={12} lg={6}>
              <div>{t('source_details.date_added')}</div>
              <small>{source.customer.date_created}</small>
            </GridItem>
            <GridItem md={12} lg={6}>
              <div>{t('source_details.currency')}</div>
              <small>USD ($)</small>
            </GridItem>
            <GridItem md={12} lg={6}>
              <div>{t('source_details.added_by')}</div>
              <small>
                {source.created_by.username} ({source.created_by.email})
              </small>
            </GridItem>
          </Grid>
        </>
      );
    default:
      return null;
  }
};

export default translate()(DetailsTableItemBase);
