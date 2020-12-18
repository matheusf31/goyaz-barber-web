type IServices = Array<{
  description: string;
  quantity: number;
}>;

interface IDayOfWeekInfo {
  clients: number;
  date: Date;
  services: IServices;
}

type IWeekInfo = {
  [key: string]: IDayOfWeekInfo;
} & {
  profitWithoutAdditionals: number;
  profitWithAdditionals: number;
  totalClientsInWeek: number;
};

interface IAppointmentsDailyInfo {
  [key: string]: IWeekInfo;
}

export type IAppointmentExtraDailyInfo = IAppointmentsDailyInfo & {
  totalClientsInMonth: number;
  totalProfitInMonthWithoutAdditionals: number;
  totalProfitInMonthWithAdditionals: number;
};
