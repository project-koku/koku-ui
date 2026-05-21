/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
export const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

export function mockDate(day: number = 1) {
  const constantDate = new Date(2018, 0, day, 0);
  (global as any).Date = class extends Date {
    constructor(dateString: string) {
      super(dateString);
      if (!dateString) {
        return constantDate;
      }
    }
  };
}
