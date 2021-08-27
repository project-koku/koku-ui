import { CostOverviewBase } from 'pages/views/details/components/costOverview/costOverviewBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { azureCostOverviewSelectors } from 'store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = WrappedComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = injectIntl(connect(mapStateToProps, {})(CostOverviewBase));

export { CostOverview };
