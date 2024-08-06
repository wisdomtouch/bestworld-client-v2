import { BranchScheduleResponse } from "@app/services/branch/branch.types";

export enum OpenType {
  AlwaysOpen = "AlwaysOpen",
  TemporaryClose = "TemporaryClose",
  OpenHours = "OpenHours",
}

export enum Days {
  Day1 = "Mon",
  Day2 = "Tue",
  Day3 = "Wed",
  Day4 = "Thu",
  Day5 = "Fri",
  Day6 = "Sat",
  Day7 = "Sun",
}

export enum BranchStatus {
  Active = "1",
  NoActive = "0",
}

export const BranchSchedule: BranchScheduleResponse[] = [
  {
    id: "",
    dateCode: "Mon",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Tue",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Wed",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Thu",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Fri",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Sat",
    openTime: "",
    closeTime: "",
  },
  {
    id: "",
    dateCode: "Sun",
    openTime: "",
    closeTime: "",
  },
];
