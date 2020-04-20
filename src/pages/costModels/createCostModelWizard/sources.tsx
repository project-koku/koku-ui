import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { CostModelContext } from './context';
import SourcesTable from './table';

class Sources extends React.Component {
  public componentDidMount() {
    const {
      dataFetched,
      type,
      query,
      page,
      perPage,
      fetchSources,
    } = this.context;
    if (dataFetched) {
      return;
    }
    const sourceType = type === 'AZURE' ? 'Azure' : type;
    fetchSources(sourceType, query, page, perPage);
  }

  public renderContent() {
    if (!this.context.dataFetched) {
      return <LoadingState />;
    }
    return <SourcesTable />;
  }

  public render() {
    return this.renderContent();
  }
}

Sources.contextType = CostModelContext;

export default Sources;
