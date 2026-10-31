import { getLocale } from "@/paraglide/runtime";

// Formatters follow the app locale (Paraglide). One Intl instance per locale, built lazily.
function localeFormatter<T>(create: (locale: string) => T) {
  const cache = new Map<string, T>();
  return () => {
    const locale = getLocale();
    let fmt = cache.get(locale);
    if (!fmt) {
      fmt = create(locale);
      cache.set(locale, fmt);
    }
    return fmt;
  };
}

function localeDateFmt(options: Intl.DateTimeFormatOptions) {
  const get = localeFormatter((l) => new Intl.DateTimeFormat(l, options));
  return { format: (date?: Date | number) => get().format(date) };
}

export const shortDateFmt = localeDateFmt({ month: "short", day: "numeric" });

export const weekdayDateFmt = localeDateFmt({
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const monthYearFmt = localeDateFmt({ month: "long", year: "numeric" });

export const hmsTimeFmt = localeDateFmt({
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const getIntFmt = localeFormatter((l) => new Intl.NumberFormat(l));
export const intFmt = (value: number) => getIntFmt().format(value);
