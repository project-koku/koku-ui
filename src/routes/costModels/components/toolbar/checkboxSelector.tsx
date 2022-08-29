import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { WithStateMachine } from 'routes/costModels/components/hoc/withStateMachine';
import { selectMachineState } from 'routes/costModels/components/logic/selectStateMachine';
import { Option } from 'routes/costModels/components/logic/types';
import React from 'react';

interface CheckboxSelectorProps {
  setSelections: (selection: string) => void;
  selections: string[];
  placeholderText: string;
  options: Option[];
  isDisabled?: boolean;
}

export const CheckboxSelector: React.SFC<CheckboxSelectorProps> = ({
  options,
  placeholderText,
  setSelections,
  selections,
  isDisabled,
}) => {
  return (
    <WithStateMachine
      machine={selectMachineState.withConfig({
        actions: {
          assignSelection: (_ctx, evt) => {
            setSelections(evt.selection);
          },
        },
      })}
    >
      {({ send, current }) => {
        return (
          <Select
            isDisabled={isDisabled}
            variant={SelectVariant.checkbox}
            placeholderText={placeholderText}
            selections={selections}
            isOpen={current.matches('expanded')}
            onSelect={(_evt, selection) => send({ type: 'SELECT', selection })}
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
