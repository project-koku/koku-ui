import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  render(
    <WithStateMachine machine={toggleMachine}>
      {({ current, send }) => {
        return <button onClick={() => send({ type: 'TOGGLE' })}>{current.matches('on') ? 'ON' : 'OFF'}</button>;
      }}
    </WithStateMachine>
  );
  const buttonNode = screen.getByRole('button');
  expect(buttonNode.outerHTML).toBe('<button>OFF</button>');
  userEvent.click(buttonNode);
  expect(buttonNode.outerHTML).toBe('<button>ON</button>');
});
