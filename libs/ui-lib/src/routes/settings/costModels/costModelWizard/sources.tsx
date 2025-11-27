import React from 'react';

import { LoadingState } from '../../../components/state/loadingState';
import { SourceStepErrorState } from '../components/errorState';
import { CostModelContext } from './context';
import SourcesTable from './sourcesTable';

class Sources extends React.Component<any, any> {
  fetchData: () => void = () => null;
  constructor(props) {
    super(props);
    this.fetchData = () => {
      const { type, query, page, perPage, fetchSources } = this.context as any;
      const sourceType = type === 'Azure' ? 'Azure' : type;
      fetchSources(sourceType, query, page, perPage);
    };
  }

  public componentDidMount() {
    const { dataFetched } = this.context as any;
    if (dataFetched) {
      return;
    }
    this.fetchData();
  }

  public renderContent() {
    if ((this.context as any).loading) {
      return <LoadingState />;
    }

    if ((this.context as any).apiError) {
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
