import { CostOverviewBase } from 'pages/details/components/costOverview/costOverviewBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { gcpCostOverviewSelectors } from 'store/costOverview/gcpCostOverview';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = WithTranslation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: gcpCostOverviewSelectors.selectWidgets(state),
    widgets: gcpCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = withTranslation()(connect(mapStateToProps, {})(CostOverviewBase));

export { CostOverview };
