import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import React from 'react';
import { useState } from 'react';
import type { Option } from 'routes/settings/costModels/components/logic/types';

interface CheckboxSelectorProps {
  setSelections: (selection: string) => void;
  selections: string[];
  placeholderText: string;
  options: Option[];
  isDisabled?: boolean;
}

export const CheckboxSelector: React.FC<CheckboxSelectorProps> = ({
  options,
  placeholderText,
  setSelections,
  selections,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      isDisabled={isDisabled}
      isOpen={isOpen}
      placeholderText={placeholderText}
      onSelect={(_evt, sel: string) => {
        setSelections(sel);
        setIsOpen(false);
      }}
      onToggle={() => setIsOpen(!isOpen)}
      selections={selections}
      variant={SelectVariant.checkbox}
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
