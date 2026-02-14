
import { format } from 'date-fns-tz';

export const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

console.log('Browser time zone detected:', browserTimeZone, " in the ", typeof window === "undefined" ? "server" : "client");

/**
 * Converts any datetime input to an ISO string with local offset
 * in the browser's IANA time zone.
 *
 * @param {string|Date} dateTimeInput - naive "YYYY-MM-DDTHH:mm",
 *                                      zoned ISO string, or Date object
 * @param {string} [targetZone] - IANA time zone (defaults to browser's)
 * @returns {string} - "2024-08-21T14:58+01:00" (example for London)
 */
export function toLocalOffsetString(
    dateTimeInput: string | Date,
    targetZone = browserTimeZone
) {
    if (!dateTimeInput) return "";
    const date = new Date(dateTimeInput);
    const base = format(date, "yyyy-MM-dd'T'HH:mm", { timeZone: targetZone });
    const offset = format(date, "xxx", { timeZone: targetZone });
    return `${base}${offset}`;
}


export const localToIsoWithOffset = (val: unknown
) => {
    if (!val) {
        return null;
    }
    // If it's already a Date, format it with local offset
    if (val instanceof Date) {
        return format(val, "yyyy-MM-dd'T'HH:mmxxx", { timeZone: browserTimeZone });
    }

    if (typeof val !== "string") {
        return null;
    }
    const m = val.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/);
    if (!m) {
        return null;
    }
    const base = m[1]; // "YYYY-MM-DDTHH:mm"
    const [datePart, timePart] = base.split("T");
    const [y, mo, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);
    const date = new Date(y, mo - 1, d, hh, mm);
    const res = format(date, "yyyy-MM-dd'T'HH:mmxxx", { timeZone: browserTimeZone });
    console.log('Converted date with local offset:', res);
    return res;
};

export const formatDate = (date: Date, targetZone = browserTimeZone, options?: {
    showDayOfWeek?: boolean;
}) => {
    const formatStr = options?.showDayOfWeek ? "EEEE, MMMM d, yyyy" : "MMMM d, yyyy";
    return format(date, formatStr, { timeZone: targetZone });
};

export const formatTime = (date: Date, targetZone = browserTimeZone) => {
    return format(date, "h:mm a", { timeZone: targetZone });
};

/**
 * Time class for creating Date objects with optional specific values
 * 
 * @example
 * // Create date with specific year and month
 * const date1 = new Time({ year: 2026, month: 5 });
 * 
 * // Create date with full timestamp
 * const date2 = new Time({ year: 2026, month: 5, day: 15, hour: 10, minute: 30, second: 0 });
 */
export class Time {
    private date: Date;

    constructor(options: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    } = {}) {
        const now = new Date();

        this.date = new Date(
            options.year ?? now.getFullYear(),
            (options.month ?? now.getMonth() + 1) - 1, // month is 0-indexed in Date
            options.day ?? now.getDate(),
            options.hour ?? now.getHours(),
            options.minute ?? now.getMinutes(),
            options.second ?? now.getSeconds(),
            0 // milliseconds
        );
    }

    /**
     * Returns the Date object
     */
    toDate(): Date {
        return new Date(this.date);
    }

    /**
     * Returns ISO string representation
     */
    toString(): string {
        return this.date.toISOString();
    }
}

/**
 * Adds time to a date
 * 
 * @param date - The base date
 * @param durationOrDate - Duration object with time units to add, or a Date to add components from
 * @returns New Date object with added time
 * 
 * @example
 * const tomorrow = addDate(new Date(), { days: 1 });
 * const nextWeek = addDate(new Date(), { weeks: 1 });
 * const nextMonth = addDate(new Date(), { months: 1, days: 5 });
 * 
 * // Add components from another date
 * const date1 = new Date('2026-01-01');
 * const date2 = new Date('2026-03-15');
 * const combined = addDate(date1, date2);
 */
export function addDate(
    date: Date,
    durationOrDate: Date | {
        years?: number;
        months?: number;
        weeks?: number;
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    }
): Date {
    const result = new Date(date);

    // If second argument is a Date, extract its components
    let duration: {
        years?: number;
        months?: number;
        weeks?: number;
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    };

    if (durationOrDate instanceof Date) {
        duration = {
            years: durationOrDate.getFullYear() - 1970, // Offset from epoch
            months: durationOrDate.getMonth(),
            days: durationOrDate.getDate() - 1, // Date is 1-indexed
            hours: durationOrDate.getHours(),
            minutes: durationOrDate.getMinutes(),
            seconds: durationOrDate.getSeconds(),
        };
    } else {
        duration = durationOrDate;
    }

    if (duration.years) {
        result.setFullYear(result.getFullYear() + duration.years);
    }
    if (duration.months) {
        result.setMonth(result.getMonth() + duration.months);
    }
    if (duration.weeks) {
        result.setDate(result.getDate() + (duration.weeks * 7));
    }
    if (duration.days) {
        result.setDate(result.getDate() + duration.days);
    }
    if (duration.hours) {
        result.setHours(result.getHours() + duration.hours);
    }
    if (duration.minutes) {
        result.setMinutes(result.getMinutes() + duration.minutes);
    }
    if (duration.seconds) {
        result.setSeconds(result.getSeconds() + duration.seconds);
    }

    return result;
}

/**
 * Subtracts time from a date
 * 
 * @param date - The base date
 * @param durationOrDate - Duration object with time units to subtract, or a Date to subtract components from
 * @returns New Date object with subtracted time
 * 
 * @example
 * const yesterday = subtractDate(new Date(), { days: 1 });
 * const lastWeek = subtractDate(new Date(), { weeks: 1 });
 * const lastMonth = subtractDate(new Date(), { months: 1 });
 * 
 * // Subtract components from another date
 * const date1 = new Date('2026-12-31');
 * const date2 = new Date('2026-03-15');
 * const result = subtractDate(date1, date2);
 */
export function subtractDate(
    date: Date,
    durationOrDate: Date | {
        years?: number;
        months?: number;
        weeks?: number;
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    }
): Date {
    const result = new Date(date);

    // If second argument is a Date, extract its components
    let duration: {
        years?: number;
        months?: number;
        weeks?: number;
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    };

    if (durationOrDate instanceof Date) {
        duration = {
            years: durationOrDate.getFullYear() - 1970, // Offset from epoch
            months: durationOrDate.getMonth(),
            days: durationOrDate.getDate() - 1, // Date is 1-indexed
            hours: durationOrDate.getHours(),
            minutes: durationOrDate.getMinutes(),
            seconds: durationOrDate.getSeconds(),
        };
    } else {
        duration = durationOrDate;
    }

    if (duration.years) {
        result.setFullYear(result.getFullYear() - duration.years);
    }
    if (duration.months) {
        result.setMonth(result.getMonth() - duration.months);
    }
    if (duration.weeks) {
        result.setDate(result.getDate() - (duration.weeks * 7));
    }
    if (duration.days) {
        result.setDate(result.getDate() - duration.days);
    }
    if (duration.hours) {
        result.setHours(result.getHours() - duration.hours);
    }
    if (duration.minutes) {
        result.setMinutes(result.getMinutes() - duration.minutes);
    }
    if (duration.seconds) {
        result.setSeconds(result.getSeconds() - duration.seconds);
    }

    return result;
}

/**
 * Calculates the difference between two dates
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Object containing the difference in various time units
 * 
 * @example
 * const diff = dateDifference(new Date('2026-12-31'), new Date('2026-01-01'));
 * console.log(diff.days); // Number of days between dates
 */
export function dateDifference(date1: Date, date2: Date) {
    const diffMs = Math.abs(date1.getTime() - date2.getTime());

    return {
        milliseconds: diffMs,
        seconds: Math.floor(diffMs / 1000),
        minutes: Math.floor(diffMs / (1000 * 60)),
        hours: Math.floor(diffMs / (1000 * 60 * 60)),
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        weeks: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)),
    };
}
