import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { ocpCostOverviewSelectors } from 'store/breakdown/costOverview/ocpCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

type CostOverviewOwnProps = WrappedComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: ocpCostOverviewSelectors.selectWidgets(state),
    widgets: ocpCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = injectIntl(connect(mapStateToProps, {})(CostOverviewBase));

export { CostOverview };
