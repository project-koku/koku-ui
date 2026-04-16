import { EmptyState, EmptyStateBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { ApiErrorService } from 'apis/api-error-service';
import type { Source } from 'apis/models/sources';
import { SourcesService } from 'apis/sources-service';
import { AddSourceWizard } from 'components/add-source-wizard/AddSourceWizard';
import { SourceRemoveModal } from 'components/modals/SourceRemoveModal';
import { SourceDetail } from 'components/sources-detail/SourceDetail';
import { SourcesTable } from 'components/sources-table/SourcesTable';
import { SourcesToolbar } from 'components/sources-table/SourcesToolbar';
import { messages } from 'i18n/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { loadEntities, setFilter, setPage, setSort } from 'redux/sources-slice';
import type { AppDispatch, RootState } from 'redux/store';

import { ListLoadingState } from './ListLoadingState';
import { SourcesEmptyState } from './SourcesEmptyState';

const styles = {
  paginationContainer: {
    marginTop: t_global_spacer_sm.var,
  },
} as { [key: string]: React.CSSProperties };

type ViewState = { type: 'list' } | { type: 'detail'; uuid: string };

const NoMatchesEmptyState: React.FC = () => {
  const intl = useIntl();
  return (
    <EmptyState icon={SearchIcon} titleText={intl.formatMessage(messages.emptyStateNoMatchesTitle)} headingLevel="h2">
      <EmptyStateBody>{intl.formatMessage(messages.emptyStateNoMatchesBody)}</EmptyStateBody>
    </EmptyState>
  );
};

NoMatchesEmptyState.displayName = 'NoMatchesEmptyState';

type SourcesFilterColumn = 'name' | 'source_type' | 'availability_status';

interface SourcesPageListContentProps {
  loading: boolean;
  sources: Source[];
  count: number;
  filterValue: string;
  filterColumn: SourcesFilterColumn;
  page: number;
  perPage: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  canWrite: boolean;
  paginationAriaLabel: string;
  onFilterChange: (value: string) => void;
  onFilterColumnChange: (column: SourcesFilterColumn) => void;
  onPageChange: (newPage: number, newPerPage: number) => void;
  onAddSource: () => void;
  onClearFilters: () => void;
  onSelectSource: (source: Source) => void;
  onRemove: (source: Source) => void;
  onTogglePause: (source: Source) => void | Promise<void>;
  onSort: (sortBy: string, direction: 'asc' | 'desc') => void;
}

const SourcesPageListContent: React.FC<SourcesPageListContentProps> = ({
  loading,
  sources,
  count,
  filterValue,
  filterColumn,
  page,
  perPage,
  sortBy,
  sortDirection,
  canWrite,
  paginationAriaLabel,
  onFilterChange,
  onFilterColumnChange,
  onPageChange,
  onAddSource,
  onClearFilters,
  onSelectSource,
  onRemove,
  onTogglePause,
  onSort,
}) => {
  const showFullPageEmpty = !loading && count === 0 && filterValue === '' && filterColumn === 'name';
  const showNoMatchesInTable = !loading && count === 0 && filterValue !== '';
  if (showFullPageEmpty) {
    return <SourcesEmptyState onAddSource={onAddSource} canWrite={canWrite} />;
  }
  const showLoadingInTable = loading && sources.length === 0;
  const emptyTableBody = showLoadingInTable ? (
    <ListLoadingState />
  ) : showNoMatchesInTable ? (
    <NoMatchesEmptyState />
  ) : undefined;
  return (
    <>
      <SourcesToolbar
        count={count}
        page={page}
        perPage={perPage}
        filterValue={filterValue}
        filterColumn={filterColumn}
        onFilterChange={onFilterChange}
        onFilterColumnChange={onFilterColumnChange}
        onPageChange={onPageChange}
        onAddSource={onAddSource}
        onClearAllFilters={onClearFilters}
        canWrite={canWrite}
      />
      <SourcesTable
        sources={sources}
        onSelectSource={onSelectSource}
        onRemove={onRemove}
        onTogglePause={onTogglePause}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
        canWrite={canWrite}
        emptyTableBody={emptyTableBody}
      />
      <div style={styles.paginationContainer}>
        <Pagination
          itemCount={count}
          page={page}
          perPage={perPage}
          variant={PaginationVariant.bottom}
          onSetPage={(_event, p) => onPageChange(p, perPage)}
          onPerPageSelect={(_event, pp) => onPageChange(1, pp)}
          titles={{
            paginationAriaLabel,
          }}
        />
      </div>
    </>
  );
};

SourcesPageListContent.displayName = 'SourcesPageListContent';

interface SourcesPageProps {
  canWrite?: boolean;
}

export const SourcesPage: React.FC<SourcesPageProps> = ({ canWrite = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const intl = useIntl();
  const addNotification = useAddNotification();
  const { entities, count, loading, filterValue, filterColumn, page, perPage, sortBy, sortDirection } = useSelector(
    (state: RootState) => state.sources
  );
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'list' });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [removeSource, setRemoveSource] = useState<Source | null>(null);

  useEffect(() => {
    dispatch(loadEntities());
  }, [dispatch, filterValue, filterColumn, page, perPage, sortBy, sortDirection]);

  const handleFilterChange = useCallback(
    (value: string) => {
      dispatch(setFilter({ filterValue: value }));
    },
    [dispatch]
  );

  const handleFilterColumnChange = useCallback(
    (column: 'name' | 'source_type' | 'availability_status') => {
      dispatch(setFilter({ filterColumn: column, filterValue: '' }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number, newPerPage: number) => {
      dispatch(setPage({ page: newPage, perPage: newPerPage }));
    },
    [dispatch]
  );

  const handleSort = useCallback(
    (newSortBy: string, direction: 'asc' | 'desc') => {
      dispatch(setSort({ sortBy: newSortBy, sortDirection: direction }));
    },
    [dispatch]
  );

  const handleAddSource = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handleWizardClose = useCallback(() => {
    setIsWizardOpen(false);
  }, []);

  const handleWizardSuccess = useCallback(() => {
    dispatch(loadEntities());
  }, [dispatch]);

  const handleSelectSource = useCallback((source: Source) => {
    setCurrentView({ type: 'detail', uuid: source.uuid });
  }, []);

  const handleTogglePause = useCallback(
    async (source: Source) => {
      const wasPausedBefore = source.paused;
      try {
        if (source.paused) {
          await SourcesService.resumeSource(source);
        } else {
          await SourcesService.pauseSource(source);
        }
        dispatch(loadEntities());
        addNotification({
          variant: 'success',
          title: intl.formatMessage(
            wasPausedBefore ? messages.resumeToggleSuccessTitle : messages.pauseToggleSuccessTitle
          ),
          dismissable: true,
        });
      } catch (e) {
        const detail = ApiErrorService.getMessage(e);
        const triedResume = source.paused;
        addNotification({
          variant: 'danger',
          title: intl.formatMessage(triedResume ? messages.resumeToggleErrorTitle : messages.pauseToggleErrorTitle),
          description: detail ?? intl.formatMessage(messages.pauseToggleErrorFallback),
          dismissable: true,
        });
      }
    },
    [dispatch, intl, addNotification]
  );

  const handleRemove = useCallback((source: Source) => {
    setRemoveSource(source);
  }, []);

  const handleRemoveSuccess = useCallback(() => {
    dispatch(loadEntities());
    setRemoveSource(null);
    setCurrentView({ type: 'list' });
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(setFilter({ filterColumn: 'name', filterValue: '' }));
  }, [dispatch]);

  return (
    <>
      {currentView.type === 'detail' ? (
        <SourceDetail uuid={currentView.uuid} onBack={() => setCurrentView({ type: 'list' })} canWrite={canWrite} />
      ) : (
        <SourcesPageListContent
          loading={loading}
          sources={entities}
          count={count}
          filterValue={filterValue}
          filterColumn={filterColumn}
          page={page}
          perPage={perPage}
          sortBy={sortBy}
          sortDirection={sortDirection}
          canWrite={canWrite}
          paginationAriaLabel={intl.formatMessage(messages.integrationsTableBottomPagination)}
          onFilterChange={handleFilterChange}
          onFilterColumnChange={handleFilterColumnChange}
          onPageChange={handlePageChange}
          onAddSource={handleAddSource}
          onClearFilters={handleClearFilters}
          onSelectSource={handleSelectSource}
          onRemove={handleRemove}
          onTogglePause={handleTogglePause}
          onSort={handleSort}
        />
      )}
      <AddSourceWizard isOpen={isWizardOpen} onClose={handleWizardClose} onSubmitSuccess={handleWizardSuccess} />
      {removeSource && (
        <SourceRemoveModal
          isOpen
          source={removeSource}
          onClose={() => setRemoveSource(null)}
          onSuccess={handleRemoveSuccess}
        />
      )}
    </>
  );
};

SourcesPage.displayName = 'SourcesPage';
