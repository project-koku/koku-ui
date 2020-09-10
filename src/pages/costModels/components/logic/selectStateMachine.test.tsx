import { createModel } from '@xstate/test';
import { assign, interpret, Interpreter } from 'xstate';

import {
  SelectMachineContext,
  SelectMachineEvents,
  selectMachineState,
  SelectMachineStates,
} from './selectStateMachine';

describe('selectmachine', () => {
  const newMachine = selectMachineState.withConfig({
    actions: {
      assignSelection: assign({
        selection: (_ctx, evt) => [evt.selection],
      }),
    },
  });

  const s = interpret(newMachine).onTransition(stt => {
    expect([stt.context, stt.toStrings()]).toMatchSnapshot();
  }) as Interpreter<SelectMachineContext, SelectMachineStates, SelectMachineEvents>;
  s.start();

  const tModel = createModel(newMachine).withEvents({
    TOGGLE: {
      exec: () => {
        s.send({ type: 'TOGGLE' });
      },
    },
    SELECT: {
      exec: () => {
        s.send({ type: 'SELECT', selection: '23' });
      },
    },
  });

  tModel.getShortestPathPlansTo('expanded').forEach(plan => {
    plan.paths.forEach(path => {
      it(`${path.description}: ${plan.description}`, () => {
        path.test({});
      });
    });
  });
});
