import { Bullseye, PageSection, Spinner } from '@patternfly/react-core';
import { pauseSource, resumeSource } from 'api/entities';
import { AddSourceWizard } from 'components/add-source-wizard/AddSourceWizard';
import { SourceRemoveModal } from 'components/modals/SourceRemoveModal';
import { SourceDetail } from 'components/sourceDetail/SourceDetail';
import { SourcesTable } from 'components/sourcesTable/SourcesTable';
import { SourcesToolbar } from 'components/sourcesTable/SourcesToolbar';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadEntities, setFilter, setPage, setSort } from 'redux/sources/sourcesSlice';
import type { AppDispatch, RootState } from 'redux/store';
import type { Source, SourceType } from 'typings/source';

import { SourcesEmptyState } from './SourcesEmptyState';

type ViewState = { type: 'list' } | { type: 'detail'; uuid: string };

interface SourcesPageProps {
  canWrite?: boolean;
}

const SourcesPage: React.FC<SourcesPageProps> = ({ canWrite = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { entities, count, loading, filterValue, filterColumn, page, perPage, sortBy, sortDirection } = useSelector(
    (state: RootState) => state.sources
  );
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'list' });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<string | undefined>();
  const [removeSource, setRemoveSource] = useState<Source | null>(null);

  useEffect(() => {
    dispatch(loadEntities());
  }, [dispatch, filterValue, filterColumn, page, perPage]);

  const handleFilterChange = useCallback(
    (value: string) => {
      dispatch(setFilter({ filterValue: value }));
      dispatch(loadEntities());
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
      dispatch(loadEntities());
    },
    [dispatch]
  );

  const handleSort = useCallback(
    (newSortBy: string, direction: 'asc' | 'desc') => {
      dispatch(setSort({ sortBy: newSortBy, sortDirection: direction }));
      dispatch(loadEntities());
    },
    [dispatch]
  );

  const handleSelectType = useCallback((sourceType: SourceType) => {
    setPreselectedType(sourceType.id);
    setIsWizardOpen(true);
  }, []);

  const handleAddSource = useCallback(() => {
    setPreselectedType(undefined);
    setIsWizardOpen(true);
  }, []);

  const handleWizardClose = useCallback(() => {
    setIsWizardOpen(false);
    setPreselectedType(undefined);
  }, []);

  const handleWizardSuccess = useCallback(() => {
    dispatch(loadEntities());
  }, [dispatch]);

  const handleSelectSource = useCallback((source: Source) => {
    setCurrentView({ type: 'detail', uuid: source.uuid });
  }, []);

  const handleTogglePause = useCallback(
    async (source: Source) => {
      try {
        if (source.paused) {
          await resumeSource(source);
        } else {
          await pauseSource(source);
        }
        dispatch(loadEntities());
      } catch {
        // TODO: add error notification
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback((source: Source) => {
    setRemoveSource(source);
  }, []);

  const handleRemoveSuccess = useCallback(() => {
    dispatch(loadEntities());
    setRemoveSource(null);
    setCurrentView({ type: 'list' });
  }, [dispatch]);

  const renderListContent = () => {
    if (loading && entities.length === 0) {
      return (
        <PageSection isFilled>
          <Bullseye>
            <Spinner size="lg" />
          </Bullseye>
        </PageSection>
      );
    }
    if (!loading && count === 0 && !filterValue) {
      return (
        <PageSection isFilled>
          <SourcesEmptyState onSelectType={handleSelectType} />
        </PageSection>
      );
    }
    return (
      <PageSection>
        <SourcesToolbar
          count={count}
          page={page}
          perPage={perPage}
          filterValue={filterValue}
          filterColumn={filterColumn}
          onFilterChange={handleFilterChange}
          onFilterColumnChange={handleFilterColumnChange}
          onPageChange={handlePageChange}
          onAddSource={handleAddSource}
          canWrite={canWrite}
        />
        <SourcesTable
          sources={entities}
          onSelectSource={handleSelectSource}
          onRemove={handleRemove}
          onTogglePause={handleTogglePause}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          canWrite={canWrite}
        />
      </PageSection>
    );
  };

  return (
    <>
      {currentView.type === 'detail' ? (
        <SourceDetail uuid={currentView.uuid} onBack={() => setCurrentView({ type: 'list' })} canWrite={canWrite} />
      ) : (
        renderListContent()
      )}
      <AddSourceWizard
        isOpen={isWizardOpen}
        onClose={handleWizardClose}
        onSubmitSuccess={handleWizardSuccess}
        preselectedType={preselectedType}
      />
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

export { SourcesPage };
