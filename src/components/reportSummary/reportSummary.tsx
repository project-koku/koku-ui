import { Title } from '@patternfly/react-core';
import React from 'react';
import { Box, BoxBody, BoxHeader } from '../box';

interface ReportSummaryProps {
  title: string;
  children?: React.ReactNode;
}

const ReportSummary: React.SFC<ReportSummaryProps> = ({ title, children }) => (
  <Box>
    <BoxHeader>
      <Title size="lg">{title}</Title>
    </BoxHeader>
    <BoxBody>{children}</BoxBody>
  </Box>
);

export { ReportSummary, ReportSummaryProps };
