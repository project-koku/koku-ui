import { CostOverviewBase } from 'pages/details/components/costOverview/costOverviewBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureCostOverviewSelectors } from 'store/costOverview/azureCostOverview';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<
  CostOverviewOwnProps,
  CostOverviewStateProps
>(state => {
  return {
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = translate()(
  connect(mapStateToProps, {})(CostOverviewBase)
);

export { CostOverview };
