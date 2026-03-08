export type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  types: string[];
};

export type HolidaysByDay = Record<string, Holiday[]>;
