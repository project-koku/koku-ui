import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarGroup,
  DataToolbarItem,
  DataToolbarItemVariant,
} from '@patternfly/react-core';
import React from 'react';

interface PriceListToolbarProps {
  primary: React.ReactNode;
  selected: string;
  secondaries: {
    component: React.ReactNode;
    name: string;
    onRemove: (category: string, chip: string) => void;
    filters: string[];
  }[];
  onClear: () => void;
  pagination: React.ReactNode;
  button: React.ReactNode;
}

export const PriceListToolbar: React.SFC<PriceListToolbarProps> = ({
  primary,
  secondaries,
  pagination,
  button,
  onClear,
  selected,
}) => {
  return (
    <DataToolbar
      clearAllFilters={onClear}
      id="price-list-toolbar"
      style={{ marginBottom: '10px', marginTop: '10px' }}
    >
      <DataToolbarContent>
        <DataToolbarGroup variant="filter-group">
          <DataToolbarItem>{primary}</DataToolbarItem>
          {secondaries.map(secondary => {
            return (
              <DataToolbarItem key={secondary.name}>
                <DataToolbarFilter
                  deleteChip={secondary.onRemove}
                  chips={secondary.filters}
                  categoryName={secondary.name}
                >
                  {selected === secondary.name ? secondary.component : ''}
                </DataToolbarFilter>
              </DataToolbarItem>
            );
          })}
        </DataToolbarGroup>
        <DataToolbarItem>{button}</DataToolbarItem>
        <DataToolbarItem variant={DataToolbarItemVariant.pagination}>
          {pagination}
        </DataToolbarItem>
      </DataToolbarContent>
      <hr className="pf-c-divider" />
    </DataToolbar>
  );
};
