import { Grid, GridItem, Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ReportSummary } from 'components/reportSummary';
import React from 'react';
import { I18n } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { styles } from './dashboard.styles';

interface Props extends RouteComponentProps<{}> {}

class Dashboard extends React.Component<Props> {
  private renderReportItem({ title }: { title: string }) {
    return (
      <GridItem xl={4} lg={6}>
        <ReportSummary title={title} />
      </GridItem>
    );
  }

  public render() {
    return (
      <I18n>
        {t => (
          <>
            <header className={css(styles.banner)}>
              <Title size={TitleSize.lg}>{t('dashboard_page.title')}</Title>
            </header>
            <div className={css(styles.content)}>
              <Grid gutter="md">
                {this.renderReportItem({
                  title: t('dashboard_page.cost_title', {
                    month: 'May',
                    date: '1st',
                  }),
                })}
                {this.renderReportItem({
                  title: t('dashboard_page.instances_title'),
                })}
                {this.renderReportItem({
                  title: t('dashboard_page.storage_title'),
                })}
              </Grid>
            </div>
          </>
        )}
      </I18n>
    );
  }
}

export default Dashboard;
