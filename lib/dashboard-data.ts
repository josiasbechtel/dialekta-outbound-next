import { SetupLeadGroup, StagedLead } from "@/types/setup";
import { Lead, LeadStatus, StatusMeta } from "@/types/dashboard";

export const statusMeta: Record<LeadStatus, StatusMeta> = {
  wait: { label: "", className: "s-wait" },
  calling: { label: "Wird angerufen...", className: "s-wait" },
  appointment: { label: "TERMIN", className: "s-appointment", final: true },
  interest: { label: "INTERESSE", className: "s-interest", final: true },
  callback: { label: "RÜCKRUF", className: "s-callback", final: true },
  not_reached: { label: "NICHT ERREICHT", className: "s-not_reached", final: true },
  not_responsible: { label: "NEUE ANSPRECHPERSON", className: "s-not_responsible", final: true },
  no_interest: { label: "KEIN INTERESSE", className: "s-no_interest", final: true },
  sales_done: { label: "ERLEDIGT", className: "s-sales_done", final: true },
  sales_deleted: { label: "GELÖSCHT", className: "s-sales_deleted", final: true },
};

const stagedLeads: StagedLead[] = [
  {
    id: "staged-1",
    company: "Müller Bau AG",
    firstName: "Luca",
    lastName: "Meier",
    phone: "+41 79 321 44 10",
    email: "luca.meier@muellerbau.ch",
    website: "www.muellerbau.ch",
    location: "Basel",
    branch: "Handwerk",
    notes: "Wichtiger Zielkunde für den ersten Testlauf.",
  },
  {
    id: "staged-2",
    company: "Cloud Base",
    firstName: "Mia",
    lastName: "Keller",
    phone: "+41 79 882 10 55",
    email: "mia.keller@cloudbase.ch",
    website: "www.cloudbase.ch",
    location: "Zürich",
    branch: "IT",
    notes: "Bereits erste Marketing-Automation im Einsatz.",
  },
  {
    id: "staged-3",
    company: "Hotel Post",
    firstName: "Lea",
    lastName: "Baumann",
    phone: "+41 79 618 07 42",
    email: "lea.baumann@hotelpost.ch",
    website: "www.hotelpost.ch",
    location: "Luzern",
    branch: "Gastro",
    notes: "Telefonisch meist vormittags erreichbar.",
  },
];

export const initialStagedLeads = stagedLeads;

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function createLead(input: StagedLead): Lead {
  return {
    ...input,
    notes: input.notes ?? "",
    status: "wait",
    planInfo: null,
    planTimestamp: 0,
    actionTs: 0,
    summary: null,
    appointmentDate: null,
    appointmentContext: null,
    ansprechpartnerName: null,
    ansprechpartnerPhone: null,
    ansprechpartnerRole: null,
  };
}

export function parseGermanDateToTimestamp(dateStr: string | null) {
  if (!dateStr) return 0;
  try {
    const parts = dateStr.split(", ");
    const dateParts = parts[0].split(".");
    const timeParts = parts[1].replace(" Uhr", "").split(":");
    const d = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
      Number(timeParts[0]),
      Number(timeParts[1]),
    );
    return d.getTime();
  } catch {
    return 0;
  }
}

export function buildSetupGroups(leads: Lead[], liveQueueIds: Set<string>): SetupLeadGroup[] {
  const readyGroups = groupByBranch(
    leads.filter((lead) => lead.status === "wait" && !lead.planInfo && !liveQueueIds.has(lead.id)),
    "ready",
  );
  const retryGroups = groupByBranch(
    leads.filter(
      (lead) => lead.status === "not_reached" && !lead.planInfo && !liveQueueIds.has(lead.id),
    ),
    "retry",
  ).map((group) => ({
    ...group,
    label: "2. VERSUCH",
    icon: "fa-solid fa-rotate-right",
  }));

  const newContactGroups = groupByBranch(
    leads.filter(
      (lead) => lead.status === "not_responsible" && !lead.planInfo && !liveQueueIds.has(lead.id),
    ),
    "new-contact",
  ).map((group) => ({
    ...group,
    label: "NEUE AP",
    icon: "fa-solid fa-user-plus",
  }));

  return [...readyGroups, ...retryGroups, ...newContactGroups];
}

function groupByBranch(leads: Lead[], kind: SetupLeadGroup["kind"]): SetupLeadGroup[] {
  const grouped = new Map<string, number>();
  leads.forEach((lead) => {
    grouped.set(lead.branch, (grouped.get(lead.branch) ?? 0) + 1);
  });

  return Array.from(grouped.entries()).map(([name, count]) => ({
    id: `${kind}-${name}`,
    name,
    count,
    kind,
  }));
}

export function buildDemoImportBatch() {
  const branches = ["Handwerk", "IT", "Gastro", "Immobilien"];
  const locations = ["Basel", "Zürich", "Bern", "Luzern", "St. Gallen", "Winterthur", "Chur"];
  const firstNames = ["Luca", "Mia", "Noah", "Elin", "Leon", "Lea", "Emma", "Julian", "Lara", "David"];
  const lastNames = ["Müller", "Meier", "Schmid", "Keller", "Weber", "Huber", "Burkhalter", "Gerber", "Baumann", "Frei"];
  const firms: Record<string, string[]> = {
    IT: ["Cyber Solutions", "Pixel AG", "Cloud Base", "Soft-Tec"],
    Handwerk: ["Müller Bau", "Holz & Design", "Elektro Swiss", "Sanitär Pro"],
    Gastro: ["Restaurant See", "Gourmet Loft", "Café Central", "Hotel Post"],
    Immobilien: ["Immo AG", "Home Finders", "Real Estate CH", "Haus & Grund"],
  };

  return Array.from({ length: 24 }, () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const company = firms[branch][Math.floor(Math.random() * firms[branch].length)];
    const website = `www.${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.ch`;

    return {
      id: uid(),
      company,
      firstName,
      lastName,
      phone: `+41 79 ${Math.floor(1000000 + Math.random() * 8999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@beispiel.ch`,
      website,
      location: locations[Math.floor(Math.random() * locations.length)],
      branch,
      notes: "",
    } satisfies StagedLead;
  });
}

export function downloadCsv(filename: string, rows: Lead[]) {
  if (typeof window === "undefined") return;
  if (rows.length === 0) return;

  let csv = "Firma,Vorname,Nachname,Telefon,Email,Webseite,Ort,Branche,Status,Notizen,Termin_am\n";
  rows.forEach((lead) => {
    const appt = lead.appointmentDate ?? "";
    csv += `"${(lead.company || "").replace(/"/g, '""')}","${lead.firstName}","${lead.lastName}","${lead.phone}","${lead.email ?? ""}","${lead.website ?? ""}","${lead.location}","${lead.branch}","${statusMeta[lead.status].label}","${(lead.notes || "").replace(/"/g, '""')}","${appt}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
