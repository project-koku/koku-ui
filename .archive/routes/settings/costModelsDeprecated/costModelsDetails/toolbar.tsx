import {
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React from 'react';

import { CreateCostModelButton } from './createCostModelButton';
import { ClearableToolbar, DescriptionFilter, NameFilter, SourceTypeFilter } from './utils/filters';
import { CostModelsFilterSelector, CostModelsTopPagination } from './utils/toolbar';

const CostModelsToolbar = () => {
  return (
    <ClearableToolbar>
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <CostModelsFilterSelector />
            </ToolbarItem>
            <NameFilter />
            <DescriptionFilter />
            <SourceTypeFilter />
          </ToolbarGroup>
        </ToolbarToggleGroup>
        <ToolbarGroup>
          <CreateCostModelButton />
        </ToolbarGroup>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          <CostModelsTopPagination />
        </ToolbarItem>
      </ToolbarContent>
    </ClearableToolbar>
  );
};

export default CostModelsToolbar;
