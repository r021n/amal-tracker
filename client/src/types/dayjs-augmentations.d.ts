import "dayjs";

declare module "dayjs" {
  interface Dayjs {
    calendar(calendar: "hijri" | "gregory"): Dayjs;
  }
}
