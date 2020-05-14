import { CostOverviewBase } from 'pages/details/components/costDetails/costOverviewBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDetailsSelectors } from 'store/details/ocpDetails';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<
  CostOverviewOwnProps,
  CostOverviewStateProps
>(state => {
  return {
    selectWidgets: ocpDetailsSelectors.selectWidgets(state),
    widgets: ocpDetailsSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = translate()(
  connect(mapStateToProps, {})(CostOverviewBase)
);

export { CostOverview };
