import { Grid, GridItem, Title } from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './emptyState.styles';

interface EmptyStateProps {
  isDollarSignIcon?: boolean;
  primaryAction?: React.ReactNode;
  subTitle?: string;
  title: string;
}

const EmptyState: React.SFC<EmptyStateProps> = ({
  isDollarSignIcon,
  primaryAction,
  subTitle,
  title,
}) => (
  <div className={css(styles.card)}>
    <div className={css(styles.cardBody)}>
      <Grid gutter="lg">
        <GridItem md={1} lg={2} />
        <GridItem md={10} lg={8}>
          {Boolean(isDollarSignIcon) && <DollarSignIcon size="xl" />}
          <Title className={css(styles.title)} size="lg">
            {title}
          </Title>
          {Boolean(subTitle) && (
            <p className={css(styles.subtitle)}>{subTitle}</p>
          )}
          {Boolean(primaryAction) && (
            <div className={css(styles.primaryAction)}>{primaryAction}</div>
          )}
        </GridItem>
        <GridItem md={1} lg={2} />
      </Grid>
    </div>
  </div>
);

export { EmptyState, EmptyStateProps };
