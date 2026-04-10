import type { OcpQuery } from 'api/queries/ocpQuery';
import type { OcpReport } from 'api/reports/ocpReports';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getResizeObserver } from 'routes/components/charts/common/chartUtils';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import { FetchStatus } from 'store/common';

import { styles } from './gpuData.styles';
import { GpuTable } from './gpuTable';
import { GpuModal } from './modal/gpuModal';
import { useMapToProps } from './utils';

interface GpuDataOwnProps {
  queryStateName: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

export interface GpuStateProps {
  isMigToggleEnabled?: boolean;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface GpuMapProps {
  query?: OcpQuery;
  queryStateName: string;
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

const GpuData: React.FC<GpuDataProps> = ({ queryStateName, reportPathsType, reportType }) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState({ ...baseQuery });
  const { isMigToggleEnabled, report, reportError, reportFetchStatus } = useMapToProps({
    query,
    queryStateName,
    reportPathsType,
    reportType,
  });

  // eslint-disable-next-line
  const [containerRef] = useState(React.createRef<HTMLDivElement>());
  const [width, setWidth] = useState(0);

  const getMoreLink = () => {
    const count = report?.meta?.count ?? 0;
    const remaining = Math.max(0, count - baseQuery.filter.limit);

    if (remaining > 0) {
      return (
        <div style={styles.linkContainer}>
          <a data-testid="gpu-lnk" href="#/" onClick={handleOnOpen}>
            {intl.formatMessage(messages.detailsMore, { value: remaining })}
          </a>
          <GpuModal
            isOpen={isOpen}
            onClose={handleOnClose}
            queryStateName={queryStateName}
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
        gridBreakPoint={width < 725 ? 'grid' : undefined}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isMigToggleEnabled={isMigToggleEnabled}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
      />
    );
  };

  const handleOnClose = (value: boolean) => {
    setIsOpen(value);
  };

  const handleOnOpen = event => {
    setIsOpen(true);
    event.preventDefault();
    return false;
  };

  const handleOnResize = () => {
    const { clientWidth = 0 } = containerRef?.current || {};
    if (clientWidth !== width) {
      setWidth(clientWidth);
    }
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  useEffect(() => {
    if (containerRef?.current) {
      const unobserve = getResizeObserver(containerRef?.current, handleOnResize);
      return () => {
        if (unobserve) {
          unobserve();
        }
      };
    }
  }, [containerRef, handleOnResize]);

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
          <div ref={containerRef}>
            {getTable()}
            {getMoreLink()}
          </div>
        )
      )}
    </>
  );
};

export { GpuData };
