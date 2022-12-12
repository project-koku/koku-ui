import React from 'react';
import { LoadingState } from 'routes/components/state/loadingState';
import { SourceStepErrorState } from 'routes/costModels/components/errorState';

import { CostModelContext } from './context';
import SourcesTable from './table';

class Sources extends React.Component {
  fetchData = () => null;
  constructor(props) {
    super(props);
    this.fetchData = () => {
      const { type, query, page, perPage, fetchSources } = this.context;
      const sourceType = type === 'Azure' ? 'Azure' : type;
      fetchSources(sourceType, query, page, perPage);
    };
  }

  public componentDidMount() {
    const { dataFetched } = this.context;
    if (dataFetched) {
      return;
    }
    this.fetchData();
  }

  public renderContent() {
    if (this.context.loading) {
      return <LoadingState />;
    }

    if (this.context.apiError) {
      return <SourceStepErrorState onRefresh={this.fetchData} />;
    }
    return <SourcesTable />;
  }

  public render() {
    return this.renderContent();
  }
}

Sources.contextType = CostModelContext;

export default Sources;
