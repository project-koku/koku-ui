import { AxiosError } from 'axios';
import { createAction, createStandardAction } from 'typesafe-actions';

interface Item {
  name: string;
  type: string;
  onDelete: () => void;
}

export const openModal = createStandardAction('dialog/delete/open')<Item>();
export const closeModal = createAction('dialog/delete/close');
export const processing = createAction('dialog/delete/processing');
export const error = createStandardAction('dialog/delete/error')<AxiosError>();
