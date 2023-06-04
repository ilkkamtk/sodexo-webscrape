// function to get today's date in ISO format
// if the day is weekend (saturday or sunday), the date is changed to next monday

const today = () => {
  let date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  // sat = 6, sun = 0
  if (date.getDay() === 6) date.setDate(date.getDate() + 2);
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

export default today;
