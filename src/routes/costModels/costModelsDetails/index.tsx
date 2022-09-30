import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions } from 'store/costModels';
import { metricsActions } from 'store/metrics';
import { rbacActions } from 'store/rbac';

import { CostModelsBottomPagination } from './bottomPagination';
import { CreateCostModelWizard } from './createCostModelButton';
import DeleteDialog from './dialog';
import Header from './header';
import CostModelsTable from './table';
import CostModelsToolbar from './toolbar';

interface PageProps {
  search: string;
  getCostModelsData: (query: string) => Promise<void>;
  getRbacData: () => Promise<void>;
  getMetricsData: () => Promise<void>;
}

class PageBase extends React.Component<PageProps> {
  componentDidMount() {
    this.props.getCostModelsData(this.props.search.slice(1));
    this.props.getRbacData();
    this.props.getMetricsData();
  }

  componentDidUpdate(prevProps: PageProps) {
    if (prevProps.search !== this.props.search) {
      this.props.getCostModelsData(this.props.search.slice(1));
    }
  }

  render() {
    return (
      <>
        <PageSection variant={PageSectionVariants.light}>
          <Header />
        </PageSection>
        <PageSection isFilled>
          <CreateCostModelWizard />
          <DeleteDialog />
          <CostModelsToolbar />
          <CostModelsTable />
          <CostModelsBottomPagination />
        </PageSection>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getCostModelsData: (query: string) => costModelsActions.fetchCostModels(query)(dispatch),
    getRbacData: () => rbacActions.fetchRbac()(dispatch),
    getMetricsData: () => metricsActions.fetchMetrics()(dispatch),
  };
};

const mapStateToProps = (state: RootState, ownProps: RouteComponentProps<any>) => {
  return {
    search: ownProps.location.search,
  };
};

const Page = connect(mapStateToProps, mapDispatchToProps)(PageBase);

export default Page;
