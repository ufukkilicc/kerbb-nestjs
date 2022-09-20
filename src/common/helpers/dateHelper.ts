export const DateHelper = (date) => {
  let result = 0;
  const now = nowDateTurkey();
  const oldDate = new Date(date);
  oldDate.setHours(oldDate.getHours());
  var seconds = (now.getTime() - oldDate.getTime()) / 1000;
  result = seconds;
  result = Math.floor(result);
  return result;
};

export const nowDateTurkey = () => {
  const str = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
  });

  const [dateValues, timeValues] = str.split(' ');

  const [day, month, year] = dateValues.split('.');
  const [hours, minutes, seconds] = timeValues.split(':');

  const date: Date = new Date(
    +year,
    +month - 1,
    +day,
    +hours,
    +minutes,
    +seconds,
  );

  //  👇️️ Sat Sep 24 2022 07:30:14
  return date;
};
