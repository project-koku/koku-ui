import { CostOverviewBase } from 'pages/details/components/costDetails/costOverviewBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsDetailsSelectors } from 'store/details/awsDetails';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<
  CostOverviewOwnProps,
  CostOverviewStateProps
>(state => {
  return {
    selectWidgets: awsDetailsSelectors.selectWidgets(state),
    widgets: awsDetailsSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = translate()(
  connect(mapStateToProps, {})(CostOverviewBase)
);

export { CostOverview };
