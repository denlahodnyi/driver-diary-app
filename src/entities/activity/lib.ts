import { CURRENCY_MINOR_UNITS } from '~/app/constants';
import type { Activity } from 'db';

const formatActivityDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

type DS<TData> = {
  byYear: Record<
    number,
    {
      byDate: Record<string, TData[]>;
      dates: string[];
    }
  >;
  years: number[];
};

export const groupActivitiesByDate = (activities: Activity[]) => {
  return activities.reduce<DS<Activity>>(
    (prev, current) => {
      const result = { ...prev };
      const date = new Date(current.date);
      const formattedDate = formatActivityDate(date);
      const year = date.getFullYear();

      if (!result.years.includes(year)) {
        result.years.push(year);
        result.byYear[year] = {
          byDate: {
            [formattedDate]: [current],
          },
          dates: [formattedDate],
        };
      } else {
        const yearDates = result.byYear[year];

        if (!yearDates.dates.includes(formattedDate)) {
          yearDates.dates.push(formattedDate);
          yearDates.byDate[formattedDate] = [current];
        } else {
          yearDates.byDate[formattedDate].push(current);
        }

        result.byYear[year] = yearDates;
      }
      return result;
    },
    { byYear: {}, years: [] },
  );
};

export const convertCostFromMinorUnits = (cost: number): number =>
  cost / CURRENCY_MINOR_UNITS;

export const convertCostToMinorUnits = (cost: number): number =>
  cost * CURRENCY_MINOR_UNITS;
