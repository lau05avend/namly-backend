import {
  comparePlannedMoments,
  getFloatingLocalNowParts,
  getLocalEntryDateDayRange,
} from './scheduled-meal-datetime.util';

describe('scheduled-meal-datetime.util', () => {
  it('resolves floating local now in America/Bogota regardless of server timezone', () => {
    const instant = new Date('2026-05-28T18:49:12.000Z');

    expect(getFloatingLocalNowParts(instant)).toEqual({
      entryDate: '2026-05-28',
      plannedTime: '13:49:12',
    });
  });

  it('builds Bogota day boundaries for meal log queries', () => {
    const { start, end } = getLocalEntryDateDayRange('2026-05-28');

    expect(start.toISOString()).toBe('2026-05-28T05:00:00.000Z');
    expect(end.toISOString()).toBe('2026-05-29T05:00:00.000Z');
  });

  it('keeps a 2:49 PM lunch upcoming at 1:49 PM Bogota', () => {
    const now = new Date('2026-05-28T18:49:00.000Z');
    const { entryDate: nowDate, plannedTime: nowTime } = getFloatingLocalNowParts(now);

    expect(comparePlannedMoments('2026-05-28', '14:49:00', nowDate, nowTime)).toBeGreaterThan(0);
  });

  it('marks a 2:49 PM lunch as past after 2:49 PM Bogota', () => {
    const now = new Date('2026-05-28T19:50:00.000Z');
    const { entryDate: nowDate, plannedTime: nowTime } = getFloatingLocalNowParts(now);

    expect(comparePlannedMoments('2026-05-28', '14:49:00', nowDate, nowTime)).toBeLessThanOrEqual(
      0,
    );
  });
});
