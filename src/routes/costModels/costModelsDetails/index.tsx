import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { RootState } from 'store';
import { costModelsActions } from 'store/costModels';
import { metricsActions } from 'store/metrics';
import { rbacActions } from 'store/rbac';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

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

const mapStateToProps = (state: RootState, ownProps: RouterComponentProps) => {
  return {
    search: ownProps.router.location.search,
  };
};

const Page = withRouter(connect(mapStateToProps, mapDispatchToProps)(PageBase));

export default Page;
