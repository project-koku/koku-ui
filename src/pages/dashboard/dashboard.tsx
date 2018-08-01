import { Grid, GridItem, Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ReportType } from 'api/reports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { styles } from './dashboard.styles';
import { formatCostSummaryDetailValue } from './dashboardUtils';
import { DashboardWidget } from './dashboardWidget';

interface Props extends RouteComponentProps<{}>, InjectedTranslateProps {}

class Dashboard extends React.Component<Props> {
  private renderReportItem(node: React.ReactNode) {
    return (
      <GridItem xl={4} lg={6}>
        {node}
      </GridItem>
    );
  }

  public render() {
    const { t } = this.props;
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    const costSummary = this.renderReportItem(
      <DashboardWidget
        reportType={ReportType.cost}
        title={t('dashboard_page.cost_title', { month, date })}
        detailLabel={t('dashboard_page.cost_detail_label')}
        detailDescription={t('dashboard_page.cost_detail_description', {
          month,
          startDate: 1,
          endDate: date,
        })}
        trendTitle={t('dashboard_page.cost_trend_title')}
        formatDetailsValue={formatCostSummaryDetailValue}
        moreLink="#"
      />
    );

    return (
      <>
        <header className={css(styles.banner)}>
          <Title size={TitleSize.lg}>{t('dashboard_page.title')}</Title>
        </header>
        <div className={css(styles.content)}>
          <Grid gutter="md">{costSummary}</Grid>
        </div>
      </>
    );
  }
}

export default translate()(Dashboard);
