import type { OcpQuery } from 'api/queries/ocpQuery';
import type { ReportPathsType } from 'api/reports/report';
import type { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import { FetchStatus } from 'store/common';

import { styles } from './gpuData.styles';
import { GpuTable } from './gpuTable';
import { GpuModal } from './modal/gpuModal';
import { useMapToProps } from './utils';

interface GpuDataOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

type GpuDataProps = GpuDataOwnProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 3,
    offset: 0,
  },
  order_by: {
    gpu_count: 'desc',
  },
};

const GpuData: React.FC<GpuDataProps> = ({ reportPathsType, reportType }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });
  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    query,
    reportPathsType,
    reportType,
  });

  const [isOpen, setIsOpen] = useState(false);

  const getMoreLink = () => {
    const count = report?.meta?.count ?? 0;
    const remaining = Math.max(0, count - baseQuery.filter.limit);

    if (remaining > 0) {
      return (
        <div style={styles.linkContainer}>
          <a data-testid="gpu-lnk" href="#/" onClick={handleOpen}>
            {intl.formatMessage(messages.detailsMore, { value: remaining })}
          </a>
          <GpuModal
            isOpen={isOpen}
            onClose={handleClose}
            reportPathsType={reportPathsType}
            reportType={reportType}
            title={intl.formatMessage(messages.gpuTitle)}
          />
        </div>
      );
    }
    return null;
  };

  const getTable = () => {
    return (
      <GpuTable
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
        reportQueryString={reportQueryString}
      />
    );
  };

  const handleClose = (value: boolean) => {
    setIsOpen(value);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const handleOpen = event => {
    setIsOpen(true);
    event.preventDefault();
    return false;
  };

  if (reportError) {
    return <NotAvailable />;
  }
  return (
    <>
      {reportFetchStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState
            body={intl.formatMessage(messages.gpuLoadingStateDesc)}
            heading={intl.formatMessage(messages.gpuLoadingStateTitle)}
          />
        </div>
      ) : (
        report?.meta?.count > 0 && (
          <>
            {getTable()}
            {getMoreLink()}
          </>
        )
      )}
    </>
  );
};

export { GpuData };
