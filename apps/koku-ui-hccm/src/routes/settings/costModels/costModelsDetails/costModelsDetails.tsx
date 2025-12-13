import { Card, CardBody } from '@patternfly/react-core';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import messages from 'locales/messages';
import { parse, stringify } from 'qs';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { RootState } from 'store';
import { costModelsActions } from 'store/costModels';
import { metricsActions } from 'store/metrics';
import { rbacActions } from 'store/rbac';
import { resourceActions } from 'store/resources';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { CostModelsBottomPagination } from './bottomPagination';
import { styles } from './costModelsDetails.styles';
import { CreateCostModelWizard } from './createCostModelButton';
import DeleteDialog from './dialog';
import CostModelsTable from './table';
import CostModelsToolbar from './toolbar';

interface CostModelsDetailsProps extends WrappedComponentProps {
  fetchResource: typeof resourceActions.fetchResource;
  getCostModelsData: (query: string) => Promise<void>;
  getMetricsData: () => Promise<void>;
  getRbacData: () => Promise<void>;
  search: string;
}

class CostModelsDetailsBase extends React.Component<CostModelsDetailsProps, any> {
  componentDidMount() {
    const { fetchResource, getCostModelsData, getMetricsData, getRbacData, search } = this.props;

    getCostModelsData(search);
    getMetricsData();
    getRbacData();

    // Fetch GPU data
    fetchResource(ResourcePathsType.ocp, ResourceType.model, '');
    fetchResource(ResourcePathsType.ocp, ResourceType.vendor, '');
  }

  componentDidUpdate(prevProps: CostModelsDetailsProps) {
    const { getCostModelsData, search } = this.props;

    if (prevProps.search !== search) {
      getCostModelsData(search);
    }
  }

  render() {
    const { intl } = this.props;

    return (
      <Card>
        <CardBody>
          {intl.formatMessage(messages.costModelsDesc, {
            learnMore: (
              <a href={intl.formatMessage(messages.docsUsingCostModels)} rel="noreferrer" target="_blank">
                {intl.formatMessage(messages.learnMore)}
              </a>
            ),
          })}
          <CreateCostModelWizard />
          <DeleteDialog />
          <div style={styles.tableContainer}>
            <CostModelsToolbar />
            <CostModelsTable />
            <div style={styles.paginationContainer}>
              <CostModelsBottomPagination />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

const mapDispatchToProps = {
  getCostModelsData: costModelsActions.fetchCostModels,
  getMetricsData: metricsActions.fetchMetrics,
  getRbacData: rbacActions.fetchRbac,
  fetchResource: resourceActions.fetchResource,
};

const mapStateToProps = (state: RootState, ownProps: RouterComponentProps) => {
  const query = parse(ownProps.router.location.search, { ignoreQueryPrefix: true });
  const searchQuery = {
    ...query,
    tabKey: undefined,
  };
  return {
    search: stringify(searchQuery, { encode: false, indices: false }),
  };
};

const CostModelsDetails = withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(CostModelsDetailsBase)));

export default CostModelsDetails;
