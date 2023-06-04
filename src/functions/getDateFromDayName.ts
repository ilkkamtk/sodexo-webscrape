export default (dayName: string, locale: string): string => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long' as const,
  };

  const dayFormatter = new Intl.DateTimeFormat(locale, dayOptions);

  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (currentDay - i));
    return dayFormatter.format(date);
  });

  const targetDayIndex = dayNames.findIndex(
    (name) => name.toLowerCase() === dayName.toLowerCase(),
  );

  let difference = targetDayIndex - currentDay;
  if (difference < 0) {
    difference += 7;
  }

  currentDate.setDate(currentDate.getDate() + difference);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long' as const,
    day: 'numeric' as const,
    weekday: 'long' as const,
  };

  const dateFormatter = new Intl.DateTimeFormat(locale, options);
  const localizedDateString = dateFormatter.format(currentDate);
  console.log(localizedDateString);
  return localizedDateString;
};
