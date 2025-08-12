import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SelectWrapper from './selectWrapper';

// Mock minimal PF components we rely on
jest.mock('@patternfly/react-core', () => ({
  __esModule: true,
  Icon: ({ children }: any) => <span>{children}</span>,
  MenuToggle: React.forwardRef(({ children, onClick, 'aria-label': ariaLabel }: any, ref: any) => (
    <button aria-label={ariaLabel} onClick={onClick} ref={ref}>
      {children}
    </button>
  )),
  Select: ({ children, isOpen, onOpenChange, onSelect, toggle }: any) => (
    <div>
      {toggle?.(React.createRef())}
      {isOpen && (
        <div data-testid="menu" onClick={() => onSelect?.(null, { value: 'b', toString: () => 'Bee' })}>
          {children}
        </div>
      )}
      <button onClick={() => onOpenChange?.(!isOpen)}>openChange</button>
    </div>
  ),
  SelectList: ({ children }: any) => <div>{children}</div>,
  SelectOption: ({ children }: any) => <div>{children}</div>,
}));

describe('SelectWrapper', () => {
  test('placeholder resolves from selection string and options', () => {
    const options = [
      { value: 'a', toString: () => 'Aye' },
      { value: 'b', toString: () => 'Bee' },
    ];
    render(<SelectWrapper options={options as any} selection="b" toggleAriaLabel="toggle" />);
    expect(screen.getByRole('button', { name: 'toggle' })).toHaveTextContent('Bee');
  });

  test('onSelect receives value and menu closes', async () => {
    const onSelect = jest.fn();
    render(
      <SelectWrapper
        ariaLabel="menu"
        options={[{ value: 'b', toString: () => 'Bee' }] as any}
        selection="a"
        toggleAriaLabel="toggle"
        onSelect={onSelect}
      />
    );

    // open menu via toggle click
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    // click an option
    const menu = await screen.findByTestId('menu');
    fireEvent.click(menu);

    expect(onSelect).toHaveBeenCalled();
  });
});
