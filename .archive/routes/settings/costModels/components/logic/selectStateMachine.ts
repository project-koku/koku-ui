import type { MachineConfig } from 'xstate';
import { Machine } from 'xstate';

export interface SelectMachineContext {
  selection?: string[];
}

export interface SelectMachineStates {
  states: {
    collapsed: any;
    expanded: any;
  };
}

export type SelectMachineEvents = { type: 'TOGGLE'; selection?: string } | { type: 'SELECT'; selection: string };

export const selectMachineConfig: MachineConfig<SelectMachineContext, SelectMachineStates, SelectMachineEvents> = {
  context: {
    selection: [],
  },
  initial: 'collapsed',
  states: {
    collapsed: {
      on: {
        TOGGLE: 'expanded',
      },
    },
    expanded: {
      on: {
        TOGGLE: 'collapsed',
        SELECT: {
          target: 'collapsed',
          actions: ['assignSelection'],
        },
      },
    },
  },
};

export const selectMachineState = Machine(selectMachineConfig);
