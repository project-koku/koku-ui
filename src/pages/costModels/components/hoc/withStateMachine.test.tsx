import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Machine } from 'xstate';

import { WithStateMachine } from './withStateMachine';

test('with state machine', () => {
  const toggleMachine = Machine({
    initial: 'off',
    states: {
      off: {
        on: {
          TOGGLE: 'on',
        },
      },
      on: {
        on: {
          TOGGLE: 'off',
        },
      },
    },
  });

  const { getByRole } = render(
    <WithStateMachine machine={toggleMachine}>
      {({ current, send }) => {
        return (
          <button onClick={() => send({ type: 'TOGGLE' })}>
            {current.matches('on') ? 'ON' : 'OFF'}
          </button>
        );
      }}
    </WithStateMachine>
  );
  const buttonNode = getByRole('button');
  expect(buttonNode.outerHTML).toBe('<button>OFF</button>');
  fireEvent.click(buttonNode);
  expect(buttonNode.outerHTML).toBe('<button>ON</button>');
});
