import { eachDayOfInterval, format, isSameDay } from "date-fns";

export function isValidCPF(cpf: string) {
  var Soma = 0;
  var Resto;

  var strCPF = String(cpf).replace(/[^\d]/g, "");

  if (strCPF.length !== 11) return false;

  if (
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].indexOf(strCPF) !== -1
  )
    return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const days: { date: Date; income: number; expenses: number }[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let currentDate = start;

  while (currentDate <= end) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const existingDay = activeDays.find(
      (day) => day.date.toISOString().split("T")[0] === formattedDate
    );

    if (existingDay) {
      days.push(existingDay);
    } else {
      days.push({ date: new Date(formattedDate), income: 0, expenses: 0 });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

export const isEmptyObject = (obj: object) => {
  return Object.keys(obj).length === 0;
};
