import { Select, SelectOption } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React from 'react';
import { WithStateMachine } from 'routes/costModels/components/hoc/withStateMachine';
import { selectMachineState } from 'routes/costModels/components/logic/selectStateMachine';
import { Option } from 'routes/costModels/components/logic/types';

export interface PrimarySelectorProps {
  setPrimary: (primary: string) => void;
  primary: string;
  options: Option[];
  isDisabled?: boolean;
}

export const PrimarySelector: React.FC<PrimarySelectorProps> = ({ setPrimary, primary, options, isDisabled }) => {
  return (
    <WithStateMachine
      machine={selectMachineState.withConfig({
        actions: {
          assignSelection: (_ctx, evt) => {
            setPrimary(evt.selection);
          },
        },
      })}
    >
      {({ current, send }) => {
        return (
          <Select
            isDisabled={isDisabled}
            toggleIcon={<FilterIcon />}
            isOpen={current.matches('expanded')}
            selections={primary}
            onSelect={(_evt, selection: string) => send({ type: 'SELECT', selection })}
            onToggle={() => send({ type: 'TOGGLE' })}
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
      }}
    </WithStateMachine>
  );
};
