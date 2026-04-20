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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { type AvailabilityFilterValue, loadEntities, setListFilters, setPage, setSort } from 'redux/sources-slice';
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

interface SourcesPageListContentProps {
  loading: boolean;
  sources: Source[];
  count: number;
  nameFilter: string;
  typeFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  page: number;
  perPage: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  canWrite: boolean;
  paginationAriaLabel: string;
  hasAnyListFilter: boolean;
  onNameFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onAvailabilityFilterChange: (value: '' | 'available' | 'unavailable') => void;
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
  nameFilter,
  typeFilter,
  availabilityFilter,
  page,
  perPage,
  sortBy,
  sortDirection,
  canWrite,
  paginationAriaLabel,
  hasAnyListFilter,
  onNameFilterChange,
  onTypeFilterChange,
  onAvailabilityFilterChange,
  onPageChange,
  onAddSource,
  onClearFilters,
  onSelectSource,
  onRemove,
  onTogglePause,
  onSort,
}) => {
  const showFullPageEmpty = !loading && count === 0 && !hasAnyListFilter;
  const showNoMatchesInTable = !loading && count === 0 && hasAnyListFilter;
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
        nameFilter={nameFilter}
        typeFilter={typeFilter}
        availabilityFilter={availabilityFilter}
        onNameFilterChange={onNameFilterChange}
        onTypeFilterChange={onTypeFilterChange}
        onAvailabilityFilterChange={onAvailabilityFilterChange}
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
  const { entities, count, loading, nameFilter, typeFilter, availabilityFilter, page, perPage, sortBy, sortDirection } =
    useSelector((state: RootState) => state.sources);
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'list' });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [removeSource, setRemoveSource] = useState<Source | null>(null);

  const hasAnyListFilter = useMemo(
    () =>
      Boolean(nameFilter) ||
      Boolean(typeFilter) ||
      availabilityFilter === 'available' ||
      availabilityFilter === 'unavailable',
    [nameFilter, typeFilter, availabilityFilter]
  );

  useEffect(() => {
    if (currentView.type === 'list') {
      dispatch(loadEntities());
    }
  }, [dispatch, currentView.type, nameFilter, typeFilter, availabilityFilter, page, perPage, sortBy, sortDirection]);

  const handleNameFilterChange = useCallback(
    (value: string) => {
      dispatch(setListFilters({ nameFilter: value }));
    },
    [dispatch]
  );

  const handleTypeFilterChange = useCallback(
    (value: string) => {
      dispatch(setListFilters({ typeFilter: value }));
    },
    [dispatch]
  );

  const handleAvailabilityFilterChange = useCallback(
    (value: '' | 'available' | 'unavailable') => {
      dispatch(setListFilters({ availabilityFilter: value }));
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
        // eslint-disable-next-line no-console -- observability for failed pause/resume (e.g. E2E / ops)
        console.error('Pause or resume integration failed', e);
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
    dispatch(setListFilters({ nameFilter: '', typeFilter: '', availabilityFilter: '' }));
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
          nameFilter={nameFilter}
          typeFilter={typeFilter}
          availabilityFilter={availabilityFilter}
          page={page}
          perPage={perPage}
          sortBy={sortBy}
          sortDirection={sortDirection}
          canWrite={canWrite}
          paginationAriaLabel={intl.formatMessage(messages.integrationsTableBottomPagination)}
          hasAnyListFilter={hasAnyListFilter}
          onNameFilterChange={handleNameFilterChange}
          onTypeFilterChange={handleTypeFilterChange}
          onAvailabilityFilterChange={handleAvailabilityFilterChange}
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
