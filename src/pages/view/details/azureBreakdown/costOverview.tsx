import { CostOverviewBase } from 'pages/view/details/components/costOverview/costOverviewBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { azureCostOverviewSelectors } from 'store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = WithTranslation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = withTranslation()(connect(mapStateToProps, {})(CostOverviewBase));

export { CostOverview };
