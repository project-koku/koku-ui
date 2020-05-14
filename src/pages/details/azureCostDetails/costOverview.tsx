import { CostOverviewBase } from 'pages/details/components/costDetails/costOverviewBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureDetailsSelectors } from 'store/details/azureDetails';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<
  CostOverviewOwnProps,
  CostOverviewStateProps
>(state => {
  return {
    selectWidgets: azureDetailsSelectors.selectWidgets(state),
    widgets: azureDetailsSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = translate()(
  connect(mapStateToProps, {})(CostOverviewBase)
);

export { CostOverview };
