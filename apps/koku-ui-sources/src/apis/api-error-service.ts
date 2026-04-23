import { isAxiosError } from 'axios';

/** Best-effort message from API error bodies (e.g. DRF `{ detail: "..." }`) for user-visible alerts. */
export const ApiErrorService = {
  getMessage(err: unknown): string | undefined {
    if (isAxiosError(err)) {
      const data = err.response?.data;
      if (typeof data === 'string' && data.trim()) {
        return data.trim();
      }
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const d = data as Record<string, unknown>;
        if (typeof d.detail === 'string' && d.detail.trim()) {
          return d.detail.trim();
        }
        for (const v of Object.values(d)) {
          if (typeof v === 'string' && v.trim()) {
            return v.trim();
          }
          if (Array.isArray(v) && v.length) {
            const first = v[0];
            if (typeof first === 'string') {
              return first;
            }
          }
        }
      }
      if (err.message) {
        return err.message;
      }
    }
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return undefined;
  },
};
