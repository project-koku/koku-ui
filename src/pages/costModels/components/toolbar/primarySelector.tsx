import { Select, SelectOption } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { WithStateMachine } from 'pages/costModels/components/hoc/withStateMachine';
import { selectMachineState } from 'pages/costModels/components/logic/selectStateMachine';
import { Option } from 'pages/costModels/components/logic/types';
import React from 'react';

export interface PrimarySelectorProps {
  setPrimary: (primary: string) => void;
  primary: string;
  options: Option[];
  isDisabled?: boolean;
}

export const PrimarySelector: React.SFC<PrimarySelectorProps> = ({ setPrimary, primary, options, isDisabled }) => {
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
