import { Grid, GridItem } from '@patternfly/react-core';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { SummaryCard } from 'pages/details/components/summary/summaryCard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface DetailsOverviewOwnProps {
  filterBy: string | number;
  groupBy: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

// tslint:disable-next-line:no-empty-interface
interface DetailsOverviewState {}

type DetailsOverviewProps = DetailsOverviewOwnProps & InjectedTranslateProps;

class DetailsOverviewBase extends React.Component<DetailsOverviewProps> {
  protected defaultState: DetailsOverviewState = {};
  public state: DetailsOverviewState = { ...this.defaultState };

  public render() {
    const { filterBy, groupBy, reportPathsType, reportType } = this.props;

    return (
      <>
        <Grid gutter="md">
          <GridItem lg={12} xl={6}>
            <SummaryCard
              filterBy={filterBy}
              groupBy="service"
              parentGroupBy={groupBy}
              reportPathsType={reportPathsType}
              reportType={reportType}
            />
          </GridItem>
          <GridItem lg={12} xl={6}>
            <SummaryCard
              filterBy={filterBy}
              groupBy="region"
              parentGroupBy={groupBy}
              reportPathsType={reportPathsType}
              reportType={reportType}
            />
          </GridItem>
        </Grid>
      </>
    );
  }
}

const DetailsOverview = translate()(DetailsOverviewBase);

export { DetailsOverview };
