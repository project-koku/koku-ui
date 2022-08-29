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
        <ToolbarGroup variant="filter-group">
          <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
            <ToolbarItem>
              <CostModelsFilterSelector />
            </ToolbarItem>
            <ToolbarItem>
              <NameFilter />
              <DescriptionFilter />
              <SourceTypeFilter />
            </ToolbarItem>
          </ToolbarToggleGroup>
          <ToolbarItem>
            <CreateCostModelButton />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          <CostModelsTopPagination />
        </ToolbarItem>
      </ToolbarContent>
    </ClearableToolbar>
  );
};

export default CostModelsToolbar;
