import { connect } from 'react-redux';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { awsCostOverviewSelectors } from 'store/breakdown/costOverview/awsCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

interface CostOverviewOwnProps {
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: awsCostOverviewSelectors.selectWidgets(state),
    widgets: awsCostOverviewSelectors.selectCurrentWidgets(state),
    title: props.title,
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
