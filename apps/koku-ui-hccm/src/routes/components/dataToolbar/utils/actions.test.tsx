import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getColumnManagement, getExportButton, getKebab, getPlatformCosts } from './actions';

describe('dataToolbar actions', () => {
  test('getColumnManagement renders button and handles click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onColumnManagementClicked = jest.fn();

    render(getColumnManagement({ onColumnManagementClicked }));

    await user.click(screen.getByRole('button'));
    expect(onColumnManagementClicked).toHaveBeenCalled();
  });

  test('getExportButton renders export button and handles click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onExportClicked = jest.fn();

    render(getExportButton({ onExportClicked }));

    await user.click(screen.getByRole('button', { name: 'Export data' }));
    expect(onExportClicked).toHaveBeenCalled();
  });

  test('getExportButton is disabled when export is disabled', () => {
    render(getExportButton({ isExportDisabled: true }));

    expect(screen.getByRole('button', { name: 'Export data' })).toBeDisabled();
  });

  test('getPlatformCosts renders switch and handles change', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onPlatformCostsChanged = jest.fn();

    render(getPlatformCosts({ isPlatformCostsChecked: false, onPlatformCostsChanged }));

    await user.click(screen.getByRole('switch'));
    expect(onPlatformCostsChanged).toHaveBeenCalledWith(true);
  });

  test('getKebab renders column management item', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onColumnManagementClicked = jest.fn();

    render(getKebab({ showColumnManagement: true, onColumnManagementClicked }));

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem'));
    expect(onColumnManagementClicked).toHaveBeenCalled();
  });

  test('getKebab renders platform costs item', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onPlatformCostsChanged = jest.fn();

    render(getKebab({ showPlatformCosts: true, isPlatformCostsChecked: false, onPlatformCostsChanged }));

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem'));
    expect(onPlatformCostsChanged).toHaveBeenCalledWith(true);
  });
});
