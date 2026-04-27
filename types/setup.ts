export type LeadGroupKind = "ready" | "retry" | "new-contact";

export type StagedLead = {
  id: string;
  company: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  website?: string;
  location: string;
  branch: string;
  notes?: string;
};

export type SetupLeadGroup = {
  id: string;
  name: string;
  count: number;
  kind: LeadGroupKind;
  label?: string;
  icon?: string;
};
