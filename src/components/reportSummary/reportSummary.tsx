import { Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { Box, BoxHeader } from '../box';
import { styles } from './reportSummary.styles';

interface Props {
  title: string;
}

const ReportSummary: React.SFC<Props> = ({ title }) => (
  <Box className={css(styles.reportSummary)}>
    <BoxHeader>
      <Title size={TitleSize.md}>{title}</Title>
    </BoxHeader>
  </Box>
);

export { ReportSummary };
