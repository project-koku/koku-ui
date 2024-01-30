import { Select, SelectOption } from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React, { useState } from 'react';
import type { Option } from 'routes/settings/costModels/components/logic/types';

export interface PrimarySelectorProps {
  setPrimary: (primary: string) => void;
  primary: string;
  options: Option[];
  isDisabled?: boolean;
}

export const PrimarySelector: React.FC<PrimarySelectorProps> = ({ setPrimary, primary, options, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      isDisabled={isDisabled}
      isOpen={isOpen}
      onSelect={(_evt, sel: string) => {
        setPrimary(sel);
        setIsOpen(false);
      }}
      onToggle={() => setIsOpen(!isOpen)}
      selections={primary}
      toggleIcon={<FilterIcon />}
    >
      {options.map(opt => {
        return (
          <SelectOption key={opt.value} value={opt.value}>
            {opt.label}
          </SelectOption>
        );
      })}
    </Select>
  );
};
