export function daysBetween(startDate: Date, endDate: Date) {
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  );
  const end = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  );
  const diff = end - start;
  return Math.round(diff / 86400000);
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function addBusinessDays(date: Date, days: number) {
  if (days === 0) return new Date(date);
  const result = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const step = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);

  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + step);
    const day = result.getUTCDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return result;
}

export function diffDateComponents(startDate: Date, endDate: Date) {
  let start = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  ));
  let end = new Date(Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  ));

  if (end < start) {
    [start, end] = [end, start];
  }

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function businessDaysBetween(
  startDate: Date,
  endDate: Date,
  includeEnd = false
) {
  const start = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  ));
  const end = new Date(Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  ));

  if (start.getTime() === end.getTime()) {
    const day = start.getUTCDay();
    const isWeekday = day !== 0 && day !== 6;
    return includeEnd && isWeekday ? 1 : 0;
  }

  const step = start < end ? 1 : -1;
  const current = new Date(start);
  let count = 0;

  while (current.getTime() !== end.getTime()) {
    current.setUTCDate(current.getUTCDate() + step);
    const day = current.getUTCDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
  }

  if (includeEnd) {
    const startDay = start.getUTCDay();
    if (startDay !== 0 && startDay !== 6) {
      count += 1;
    }
  }

  return count;
}

export function weekdayWeekendCounts(
  startDate: Date,
  endDate: Date,
  includeEnd = false
) {
  const start = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate()
    )
  );
  const end = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate()
    )
  );

  const counts = { weekdays: 0, weekends: 0 };

  if (start.getTime() === end.getTime()) {
    if (!includeEnd) return counts;
    const day = start.getUTCDay();
    if (day === 0 || day === 6) {
      counts.weekends += 1;
    } else {
      counts.weekdays += 1;
    }
    return counts;
  }

  const step = start < end ? 1 : -1;
  const current = new Date(start);

  while (current.getTime() !== end.getTime()) {
    current.setUTCDate(current.getUTCDate() + step);
    const day = current.getUTCDay();
    if (day === 0 || day === 6) {
      counts.weekends += 1;
    } else {
      counts.weekdays += 1;
    }
  }

  if (includeEnd) {
    const startDay = start.getUTCDay();
    if (startDay === 0 || startDay === 6) {
      counts.weekends += 1;
    } else {
      counts.weekdays += 1;
    }
  }

  return counts;
}
