import { StagedLead } from "@/types/setup";

export type LeadStatus =
  | "wait"
  | "calling"
  | "appointment"
  | "interest"
  | "callback"
  | "not_reached"
  | "not_responsible"
  | "no_interest"
  | "sales_done"
  | "sales_deleted";

export type Lead = StagedLead & {
  status: LeadStatus;
  planInfo: string | null;
  planTimestamp: number;
  actionTs: number;
  summary: string | null;
  appointmentDate: string | null;
  appointmentContext: string | null;
  ansprechpartnerName: string | null;
  ansprechpartnerPhone: string | null;
  ansprechpartnerRole: string | null;
  prevStatus?: LeadStatus;
};

export type LiveQueue = {
  id: string;
  branch: string;
  ids: string[];
  total: number;
  isPlanned: boolean;
  planDate: string | null;
  planFrom: string | null;
  planTo: string | null;
  planTimestamp: number;
};

export type VertriebTab = "hot" | "archiv";
export type TermineTab = "active" | "archiv";

export type StatusMeta = {
  label: string;
  className: string;
  final?: boolean;
};
