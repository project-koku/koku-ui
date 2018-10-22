// import { css } from '@patternfly/react-styles';
import {
  Button,
  Select,
  SelectOption,
  TextInput,
  Toolbar as PFToolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { DownloadIcon, SortNumericDownIcon } from '@patternfly/react-icons';
import React from 'react';
import { noop } from '../../utils/noop';

export const Toolbar = ({ placeholder, value, onChange }) => (
  <PFToolbar>
    <ToolbarGroup>
      <ToolbarItem>
        <TextInput
          isAlt
          placeholder={placeholder}
          aria-label="filter text input"
          onChange={onChange}
        />
      </ToolbarItem>
    </ToolbarGroup>
    <ToolbarGroup>
      <ToolbarItem>
        <Select
          value={'Sort by: Cost'}
          onBlur={noop}
          onFocus={noop}
          onChange={noop}
          aria-label="sort by selector"
        >
          <SelectOption value="cost" label={'Sort by: Cost'} />
          <SelectOption value="rate" label={'Sort by: Rate'} />
        </Select>
      </ToolbarItem>
      <ToolbarItem>
        <Button variant="plain" aria-label="sort">
          <SortNumericDownIcon />
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
    <ToolbarGroup>
      <ToolbarItem>
        <Button variant="plain" aria-label="download as CSV">
          <DownloadIcon /> Export
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  </PFToolbar>
);
