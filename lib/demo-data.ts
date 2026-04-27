import { SetupLeadGroup, StagedLead } from "@/types/setup";

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

const groups: SetupLeadGroup[] = [
  { id: "ready-1", name: "Handwerk", count: 18, kind: "ready" },
  { id: "ready-2", name: "IT", count: 14, kind: "ready" },
  { id: "ready-3", name: "Gastro", count: 9, kind: "ready" },
  {
    id: "retry-1",
    name: "Zuerich Nord",
    count: 6,
    kind: "retry",
    label: "2. VERSUCH",
    icon: "fa-solid fa-rotate-right",
  },
  {
    id: "new-contact-1",
    name: "Basel Land",
    count: 4,
    kind: "new-contact",
    label: "NEUE AP",
    icon: "fa-solid fa-user-plus",
  },
];

export const setupDemoState = {
  stagedLeads,
  groups,
};

export const liveQueueDemo = [
  {
    title: "Handwerk",
    done: 7,
    total: 18,
    status: "Aktiver Anruf",
    phone: "+41 79 445 11 92",
  },
  {
    title: "IT",
    done: 2,
    total: 14,
    status: "Geplant: 28.04., 09:00-12:00 Uhr",
    phone: "",
  },
];

export const resultLeads = [
  {
    company: "Müller Bau",
    name: "Luca Meier",
    phone: "+41 79 321 44 10",
    badge: "TERMIN",
    badgeClass: "s-appointment",
    summary: "Sehr positives Gespräch. Termin für ein erstes Kennenlernen vereinbart.",
  },
  {
    company: "Pixel AG",
    name: "Mia Keller",
    phone: "+41 79 882 10 55",
    badge: "INTERESSE",
    badgeClass: "s-interest",
    summary: "Hat Interesse gezeigt. Follow-up durch Vertrieb sinnvoll.",
  },
];

export const salesLeads = [
  {
    company: "Cloud Base",
    name: "Julia Schmid",
    phone: "+41 78 114 77 00",
    badge: "RÜCKRUF",
    badgeClass: "s-callback",
  },
  {
    company: "Cyber Solutions",
    name: "Sarah Frei",
    phone: "+41 79 220 18 09",
    badge: "INTERESSE",
    badgeClass: "s-interest",
  },
];

export const appointmentLeads = [
  {
    company: "Hotel Post",
    name: "Lea Baumann",
    phone: "+41 79 618 07 42",
    time: "29.04.2026, 10:00 Uhr",
  },
  {
    company: "Real Estate CH",
    name: "David Huber",
    phone: "+41 78 335 81 22",
    time: "30.04.2026, 14:00 Uhr",
  },
];
