import { AxiosError } from 'axios';

import { ApiErrorService } from './api-error-service';

describe('ApiErrorService', () => {
  describe('getMessage', () => {
    it('returns detail from AxiosError response JSON', () => {
      const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        data: { detail: 'Not allowed' },
      } as AxiosError['response']);
      expect(ApiErrorService.getMessage(err)).toBe('Not allowed');
    });

    it('returns first field error string from DRF-style body', () => {
      const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        data: { source_type: ['Either source_type or source_type_id is required'] },
      } as AxiosError['response']);
      expect(ApiErrorService.getMessage(err)).toBe('Either source_type or source_type_id is required');
    });

    it('returns Error.message for plain Error', () => {
      expect(ApiErrorService.getMessage(new Error('network down'))).toBe('network down');
    });
  });
});
