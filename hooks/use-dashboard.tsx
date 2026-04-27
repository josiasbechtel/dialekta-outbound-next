"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createContext } from "react";
import {
  buildDemoImportBatch,
  buildSetupGroups,
  createLead,
  downloadCsv,
  initialStagedLeads,
  parseGermanDateToTimestamp,
  statusMeta,
  uid,
} from "@/lib/dashboard-data";
import { Lead, LiveQueue, TermineTab, VertriebTab } from "@/types/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase-client";
import { loadDashboardState, saveDashboardState } from "@/lib/supabase-sync";
import { SetupLeadGroup, StagedLead } from "@/types/setup";

type PlanForm = {
  date: string;
  timeFrom: string;
  timeTo: string;
};

type ToastState = {
  message: string;
  icon: string;
} | null;

type DashboardContextValue = {
  leads: Lead[];
  staged: StagedLead[];
  liveQueue: LiveQueue[];
  currentCallId: string | null;
  vertriebTab: VertriebTab;
  termineTab: TermineTab;
  searchTerm: string;
  setupGroups: SetupLeadGroup[];
  listReviewLeads: Lead[] | StagedLead[];
  listReviewTitle: string;
  isListReviewOpen: boolean;
  isEditOpen: boolean;
  isPlanOpen: boolean;
  isDetailOpen: boolean;
  editingLead: Lead | StagedLead | null;
  detailLead: Lead | null;
  planningGroup: { ids: string[]; branch: string; queueId?: string | null } | null;
  initialPlanValues: PlanForm | null;
  toast: ToastState;
  readyGroups: SetupLeadGroup[];
  retryGroups: SetupLeadGroup[];
  newContactGroups: SetupLeadGroup[];
  historyLeads: Lead[];
  salesLeads: Lead[];
  appointmentLeads: Lead[];
  upcomingAppointments: number;
  analytics: {
    total: number;
    done: number;
    open: number;
    conversion: number;
    byStatus: Array<{ status: string; label: string; count: number; pct: number }>;
    byBranch: Array<{ branch: string; total: number; done: number; appointments: number }>;
  };
  setSearchTerm: (value: string) => void;
  toggleVertriebTab: () => void;
  toggleTermineTab: () => void;
  loadDemoData: () => void;
  resetSystem: () => void;
  acceptImport: () => void;
  openStagedList: () => void;
  openGroupPreview: (group: SetupLeadGroup) => void;
  openQueuePreview: (queueId: string) => void;
  closeListReview: () => void;
  openLeadEditor: (lead?: Lead | StagedLead | null) => void;
  closeLeadEditor: () => void;
  saveLead: (lead: StagedLead) => void;
  deleteEditingLead: () => void;
  openDetail: (leadId: string) => void;
  closeDetail: () => void;
  openPlan: (group: SetupLeadGroup) => void;
  openPlanForQueue: (queueId: string) => void;
  closePlan: () => void;
  savePlan: (plan: PlanForm) => void;
  startRun: (ids: string[], branch: string, plan?: PlanForm) => void;
  exportSalesCsv: () => void;
  exportBranchCsv: (branch: string) => void;
  exportAllCsv: () => void;
  markSalesDone: (leadId: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);
const STORAGE_KEY = "dialekta-outbound-dashboard-state-v1";

const todayValue = () => new Date().toISOString().split("T")[0];

function formatPlanInfo(plan: PlanForm) {
  const dateParts = plan.date.split("-");
  return `${dateParts[2]}.${dateParts[1]}. ${plan.timeFrom}-${plan.timeTo}h`;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staged, setStaged] = useState<StagedLead[]>(initialStagedLeads);
  const [liveQueue, setLiveQueue] = useState<LiveQueue[]>([]);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [vertriebTab, setVertriebTab] = useState<VertriebTab>("hot");
  const [termineTab, setTermineTab] = useState<TermineTab>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isListReviewOpen, setIsListReviewOpen] = useState(false);
  const [listReviewTitle, setListReviewTitle] = useState("Importierte Liste");
  const [listReviewLeads, setListReviewLeads] = useState<Array<Lead | StagedLead>>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | StagedLead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [planningGroup, setPlanningGroup] = useState<{
    ids: string[];
    branch: string;
    queueId?: string | null;
  } | null>(null);
  const [initialPlanValues, setInitialPlanValues] = useState<PlanForm | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimerRef = useRef<number | null>(null);
  const hasLoadedPersistedStateRef = useRef(false);
  const hasHydratedRemoteStateRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, icon = "fa-check-circle") => {
    setToast({ message, icon });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hydrate = async () => {
      try {
        if (isSupabaseConfigured) {
          const remoteState = await loadDashboardState();
          if (remoteState) {
            setLeads(remoteState.leads);
            setStaged(remoteState.staged.length > 0 || remoteState.leads.length > 0 ? remoteState.staged : initialStagedLeads);
            setLiveQueue(remoteState.liveQueue);
            setCurrentCallId(remoteState.currentCallId);
            hasHydratedRemoteStateRef.current = true;
          }
          return;
        }

        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as {
          leads?: Lead[];
          staged?: StagedLead[];
          liveQueue?: LiveQueue[];
          currentCallId?: string | null;
          vertriebTab?: VertriebTab;
          termineTab?: TermineTab;
          searchTerm?: string;
        };

        setLeads(parsed.leads ?? []);
        setStaged(parsed.staged ?? initialStagedLeads);
        setLiveQueue(parsed.liveQueue ?? []);
        setCurrentCallId(parsed.currentCallId ?? null);
        setVertriebTab(parsed.vertriebTab ?? "hot");
        setTermineTab(parsed.termineTab ?? "active");
        setSearchTerm(parsed.searchTerm ?? "");
      } catch (error) {
        console.error("Dashboard-Daten konnten nicht geladen werden", error);
      } finally {
        hasLoadedPersistedStateRef.current = true;
      }
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedPersistedStateRef.current) return;

    if (isSupabaseConfigured) {
      if (!hasHydratedRemoteStateRef.current) return;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        void saveDashboardState({ leads, staged, liveQueue, currentCallId }).catch((error) => {
          console.error("Dashboard-Daten konnten nicht in Supabase gespeichert werden", error);
        });
      }, 500);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        leads,
        staged,
        liveQueue,
        currentCallId,
        vertriebTab,
        termineTab,
        searchTerm,
      }),
    );
  }, [currentCallId, leads, liveQueue, searchTerm, staged, termineTab, vertriebTab]);

  const liveQueueIds = useMemo(() => new Set(liveQueue.flatMap((queue) => queue.ids)), [liveQueue]);
  const setupGroups = useMemo(() => buildSetupGroups(leads, liveQueueIds), [leads, liveQueueIds]);
  const readyGroups = useMemo(() => setupGroups.filter((group) => group.kind === "ready"), [setupGroups]);
  const retryGroups = useMemo(() => setupGroups.filter((group) => group.kind === "retry"), [setupGroups]);
  const newContactGroups = useMemo(
    () => setupGroups.filter((group) => group.kind === "new-contact"),
    [setupGroups],
  );

  const detailLead = useMemo(
    () => leads.find((lead) => lead.id === detailLeadId) ?? null,
    [detailLeadId, leads],
  );

  const historyLeads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return leads
      .filter((lead) => !["wait", "calling"].includes(lead.status))
      .filter((lead) => {
        if (!query) return true;
        return [lead.company, lead.firstName, lead.lastName, lead.location, lead.branch]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.actionTs - a.actionTs);
  }, [leads, searchTerm]);

  const salesLeads = useMemo(() => {
    const targetStatuses =
      vertriebTab === "archiv" ? ["sales_done", "sales_deleted"] : ["interest", "callback"];
    return leads
      .filter((lead) => targetStatuses.includes(lead.status))
      .sort((a, b) => b.actionTs - a.actionTs);
  }, [leads, vertriebTab]);

  const appointmentLeads = useMemo(() => {
    const now = Date.now();
    return leads
      .filter((lead) => lead.status === "appointment")
      .filter((lead) => {
        const ts = parseGermanDateToTimestamp(lead.appointmentDate);
        const isPast = ts > 0 && ts < now;
        return termineTab === "archiv" ? isPast : !isPast;
      })
      .sort((a, b) => {
        const tsA = parseGermanDateToTimestamp(a.appointmentDate);
        const tsB = parseGermanDateToTimestamp(b.appointmentDate);
        return termineTab === "archiv" ? tsB - tsA : tsA - tsB;
      });
  }, [leads, termineTab]);

  const upcomingAppointments = useMemo(() => {
    const now = Date.now();
    return leads.filter((lead) => {
      if (lead.status !== "appointment") return false;
      const ts = parseGermanDateToTimestamp(lead.appointmentDate);
      return ts === 0 || ts >= now;
    }).length;
  }, [leads]);

  const analytics = useMemo(() => {
    const total = leads.length;
    const done = leads.filter((lead) => statusMeta[lead.status]?.final).length;
    const appointments = leads.filter(
      (lead) => lead.status === "appointment" || lead.prevStatus === "appointment",
    ).length;
    const conversion = total > 0 ? Math.round((appointments / total) * 100) : 0;
    const statusesToTrack = [
      "appointment",
      "interest",
      "callback",
      "not_reached",
      "no_interest",
      "not_responsible",
      "sales_done",
    ] as const;
    const byStatus = statusesToTrack
      .map((status) => {
        const count = leads.filter((lead) => lead.status === status).length;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return { status, label: statusMeta[status].label, count, pct };
      })
      .filter((item) => item.count > 0 || item.status !== "sales_done");

    const branchNames = [...new Set(leads.map((lead) => lead.branch))];
    const byBranch = branchNames.map((branch) => {
      const branchLeads = leads.filter((lead) => lead.branch === branch);
      return {
        branch,
        total: branchLeads.length,
        done: branchLeads.filter((lead) => statusMeta[lead.status]?.final).length,
        appointments: branchLeads.filter((lead) => lead.status === "appointment").length,
      };
    });

    return { total, done, open: total - done, conversion, byStatus, byBranch };
  }, [leads]);

  const runSimulationTick = useCallback(() => {
    setLeads((currentLeads) => {
      let nextLeads = [...currentLeads];

      if (currentCallId) {
        const idx = nextLeads.findIndex((lead) => lead.id === currentCallId);
        if (idx >= 0) {
          const lead = { ...nextLeads[idx] };
          const outcomes: Lead["status"][] = [
            "appointment",
            "interest",
            "callback",
            "not_reached",
            "no_interest",
            "not_responsible",
          ];
          const newStatus = outcomes[Math.floor(Math.random() * outcomes.length)];
          lead.status = newStatus;
          lead.actionTs = Date.now();
          if (newStatus === "not_responsible") {
            const firstNames = ["Lars", "Sarah", "Kevin", "Julia", "Michael"];
            const lastNames = ["Müller", "Meier", "Bauer", "Wagner", "Schmid"];
            const roles = ["IT-Leiter", "Geschäftsführer", "Einkaufsleiter", "Abteilungsleiter"];
            lead.ansprechpartnerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
            lead.ansprechpartnerRole = roles[Math.floor(Math.random() * roles.length)];
            lead.ansprechpartnerPhone = `+41 78 ${Math.floor(1000000 + Math.random() * 8999999)}`;
            lead.summary = `Ist nicht zuständig. Hat mich an ${lead.ansprechpartnerName} (${lead.ansprechpartnerRole}) verwiesen. Bitte dort anrufen.`;
          } else if (newStatus === "appointment") {
            const d = new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            const hours = [9, 10, 11, 13, 14, 15, 16][Math.floor(Math.random() * 7)];
            lead.summary = "Sehr positives Gespräch. Termin für ein erstes Kennenlernen/Demo vereinbart.";
            lead.appointmentDate = `${day}.${month}.${year}, ${String(hours).padStart(2, "0")}:00 Uhr`;
            lead.appointmentContext = "Schnittstelle: KI Sprach-Assistent";
          } else if (newStatus === "interest" || newStatus === "callback") {
            lead.summary =
              "Hat Interesse gezeigt. Bitte zeitnah das Follow-Up und die weitere Qualifizierung übernehmen.";
          } else {
            lead.summary = lead.summary ?? "";
          }
          nextLeads[idx] = lead;
        }
      }

      setCurrentCallId(null);
      setLiveQueue((currentQueues) => {
        const updatedQueues = [...currentQueues];
        let nextLeadId: string | null = null;
        let activeIndex = 0;

        while (activeIndex < updatedQueues.length && !nextLeadId) {
          const activeQueue = updatedQueues[activeIndex];
          if (activeQueue.isPlanned && activeQueue.planTimestamp > Date.now()) {
            activeIndex += 1;
            continue;
          }

          const waitingLead = nextLeads.find(
            (lead) => activeQueue.ids.includes(lead.id) && lead.status === "wait",
          );

          if (!waitingLead) {
            updatedQueues.splice(activeIndex, 1);
            continue;
          }

          nextLeadId = waitingLead.id;
          waitingLead.status = "calling";
        }

        if (nextLeadId) {
          setCurrentCallId(nextLeadId);
        }

        return updatedQueues;
      });

      return nextLeads;
    });
  }, [currentCallId]);

  useEffect(() => {
    if (liveQueue.length === 0) return;
    const timer = window.setInterval(runSimulationTick, 3500);
    return () => window.clearInterval(timer);
  }, [liveQueue.length, runSimulationTick]);

  useEffect(() => {
    if (liveQueue.length === 0 || currentCallId) return;
    const timer = window.setTimeout(() => runSimulationTick(), 150);
    return () => window.clearTimeout(timer);
  }, [currentCallId, liveQueue.length, runSimulationTick]);

  const loadDemoData = useCallback(() => {
    setStaged((current) => [...current, ...buildDemoImportBatch()]);
    showToast("Frische Demo-Daten importiert", "fa-wand-magic-sparkles");
  }, [showToast]);

  const resetSystem = useCallback(() => {
    setLeads([]);
    setStaged([]);
    setLiveQueue([]);
    setCurrentCallId(null);
    setSearchTerm("");
    setVertriebTab("hot");
    setTermineTab("active");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    showToast("System zurückgesetzt", "fa-rotate-right");
  }, [showToast]);

  const acceptImport = useCallback(() => {
    if (staged.length === 0) {
      showToast("Keine Daten zum Übernehmen", "fa-circle-info");
      return;
    }
    setLeads((current) => [...current, ...staged.map(createLead)]);
    setStaged([]);
    setIsListReviewOpen(false);
    showToast("Daten ins System übernommen!", "fa-check");
  }, [showToast, staged]);

  const openStagedList = useCallback(() => {
    if (staged.length === 0) return;
    setListReviewTitle("Importierte Liste");
    setListReviewLeads(staged);
    setIsListReviewOpen(true);
  }, [staged]);

  const openGroupPreview = useCallback(
    (group: SetupLeadGroup) => {
      const title =
        group.kind === "retry"
          ? `${group.name} (2. Versuch)`
          : group.kind === "new-contact"
            ? `${group.name} (Neue AP)`
            : group.name;
      const matchingLeads =
        group.kind === "ready"
          ? leads.filter((lead) => lead.branch === group.name && lead.status === "wait")
          : group.kind === "retry"
            ? leads.filter((lead) => lead.branch === group.name && lead.status === "not_reached")
            : leads.filter(
                (lead) => lead.branch === group.name && lead.status === "not_responsible",
              );
      setListReviewTitle(title);
      setListReviewLeads(matchingLeads);
      setIsListReviewOpen(true);
    },
    [leads],
  );

  const openQueuePreview = useCallback(
    (queueId: string) => {
      const queue = liveQueue.find((item) => item.id === queueId);
      if (!queue) return;
      setListReviewTitle("Leads in Warteschlange");
      setListReviewLeads(leads.filter((lead) => queue.ids.includes(lead.id)));
      setIsListReviewOpen(true);
    },
    [leads, liveQueue],
  );

  const openLeadEditor = useCallback((lead?: Lead | StagedLead | null) => {
    setEditingLead(lead ?? null);
    setIsEditOpen(true);
  }, []);

  const closeLeadEditor = useCallback(() => {
    setIsEditOpen(false);
    setEditingLead(null);
  }, []);

  const saveLead = useCallback(
    (leadInput: StagedLead) => {
      const targetId = leadInput.id;
      const leadInStaged = staged.some((lead) => lead.id === targetId);
      if (leadInStaged || !leads.some((lead) => lead.id === targetId)) {
        setStaged((current) => {
          const exists = current.some((item) => item.id === targetId);
          return exists
            ? current.map((item) => (item.id === targetId ? leadInput : item))
            : [leadInput, ...current];
        });
      } else {
        setLeads((current) =>
          current.map((item) =>
            item.id === targetId
              ? {
                  ...item,
                  ...leadInput,
                }
              : item,
          ),
        );
      }
      setIsEditOpen(false);
      showToast(editingLead ? "Lead aktualisiert" : "Lead hinzugefügt", "fa-check");
      setEditingLead(null);
    },
    [editingLead, leads, showToast, staged],
  );

  const deleteEditingLead = useCallback(() => {
    if (!editingLead) return;
    setStaged((current) => current.filter((lead) => lead.id !== editingLead.id));
    setLeads((current) => current.filter((lead) => lead.id !== editingLead.id));
    setLiveQueue((current) =>
      current
        .map((queue) => ({
          ...queue,
          ids: queue.ids.filter((id) => id !== editingLead.id),
          total: queue.ids.filter((id) => id !== editingLead.id).length,
        }))
        .filter((queue) => queue.total > 0),
    );
    setIsEditOpen(false);
    setEditingLead(null);
    showToast("Lead gelöscht", "fa-trash-can");
  }, [editingLead, showToast]);

  const openDetail = useCallback((leadId: string) => {
    setDetailLeadId(leadId);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const openPlan = useCallback(
    (group: SetupLeadGroup) => {
      const ids =
        group.kind === "ready"
          ? leads.filter((lead) => lead.branch === group.name && lead.status === "wait")
          : group.kind === "retry"
            ? leads.filter((lead) => lead.branch === group.name && lead.status === "not_reached")
            : leads.filter(
                (lead) => lead.branch === group.name && lead.status === "not_responsible",
              );
      setPlanningGroup({ ids: ids.map((lead) => lead.id), branch: group.name });
      setInitialPlanValues({
        date: todayValue(),
        timeFrom: "09:00",
        timeTo: "12:00",
      });
      setIsPlanOpen(true);
    },
    [leads],
  );

  const openPlanForQueue = useCallback(
    (queueId: string) => {
      const queue = liveQueue.find((item) => item.id === queueId);
      if (!queue) return;
      setPlanningGroup({ ids: queue.ids, branch: queue.branch, queueId });
      setInitialPlanValues({
        date: queue.planDate ?? todayValue(),
        timeFrom: queue.planFrom ?? "09:00",
        timeTo: queue.planTo ?? "12:00",
      });
      setIsPlanOpen(true);
    },
    [liveQueue],
  );

  const closePlan = useCallback(() => {
    setIsPlanOpen(false);
    setInitialPlanValues(null);
  }, []);

  const startRun = useCallback(
    (ids: string[], branch: string, plan?: PlanForm) => {
      if (ids.length === 0) return;

      setLeads((current) =>
        current.map((lead) => {
          if (!ids.includes(lead.id)) return lead;
          if (lead.status === "not_responsible" && lead.ansprechpartnerName) {
            const nameParts = lead.ansprechpartnerName.split(" ");
            return {
              ...lead,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(" "),
              phone: lead.ansprechpartnerPhone || lead.phone,
              ansprechpartnerName: null,
              ansprechpartnerPhone: null,
              ansprechpartnerRole: null,
              summary: "",
              appointmentDate: null,
              appointmentContext: null,
              status: "wait",
              planInfo: plan ? formatPlanInfo(plan) : null,
              planTimestamp: plan ? new Date(`${plan.date}T${plan.timeFrom}`).getTime() : 0,
            };
          }
          return {
            ...lead,
            status: "wait",
            planInfo: plan ? formatPlanInfo(plan) : null,
            planTimestamp: plan ? new Date(`${plan.date}T${plan.timeFrom}`).getTime() : 0,
          };
        }),
      );

      setLiveQueue((current) => [
        ...current,
        {
          id: uid(),
          branch,
          ids,
          total: ids.length,
          isPlanned: Boolean(plan),
          planDate: plan?.date ?? null,
          planFrom: plan?.timeFrom ?? null,
          planTo: plan?.timeTo ?? null,
          planTimestamp: plan ? new Date(`${plan.date}T${plan.timeFrom}`).getTime() : 0,
        },
      ]);

      showToast("Durchlauf gestartet", "fa-play");
    },
    [showToast],
  );

  const savePlan = useCallback(
    (plan: PlanForm) => {
      if (!planningGroup) return;
      if (planningGroup.queueId) {
        setLiveQueue((current) =>
          current.map((queue) =>
            queue.id === planningGroup.queueId
              ? {
                  ...queue,
                  planDate: plan.date,
                  planFrom: plan.timeFrom,
                  planTo: plan.timeTo,
                  planTimestamp: new Date(`${plan.date}T${plan.timeFrom}`).getTime(),
                  isPlanned: true,
                }
              : queue,
          ),
        );
        setLeads((current) =>
          current.map((lead) =>
            planningGroup.ids.includes(lead.id)
              ? {
                  ...lead,
                  planInfo: formatPlanInfo(plan),
                  planTimestamp: new Date(`${plan.date}T${plan.timeFrom}`).getTime(),
                }
              : lead,
          ),
        );
        showToast("Planung aktualisiert", "fa-calendar-check");
      } else {
        startRun(planningGroup.ids, planningGroup.branch, plan);
      }
      setIsPlanOpen(false);
      setPlanningGroup(null);
      setInitialPlanValues(null);
    },
    [planningGroup, showToast, startRun],
  );

  const exportSalesCsv = useCallback(() => {
    const rows = leads.filter((lead) => ["interest", "callback"].includes(lead.status));
    downloadCsv("Vertriebs_Leads.csv", rows);
    showToast("Export erfolgreich", "fa-download");
  }, [leads, showToast]);

  const exportBranchCsv = useCallback(
    (branch: string) => {
      const rows = leads.filter((lead) => lead.branch === branch);
      downloadCsv(`Listen_Export_${branch}.csv`, rows);
      showToast("Export erfolgreich", "fa-download");
    },
    [leads, showToast],
  );

  const exportAllCsv = useCallback(() => {
    downloadCsv("Full_CRM_Backup.csv", leads);
    showToast("Export erfolgreich", "fa-download");
  }, [leads, showToast]);

  const markSalesDone = useCallback(
    (leadId: string) => {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === leadId ? { ...lead, prevStatus: lead.status, status: "sales_done" } : lead,
        ),
      );
      showToast("Lead erledigt", "fa-check");
    },
    [showToast],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      leads,
      staged,
      liveQueue,
      currentCallId,
      vertriebTab,
      termineTab,
      searchTerm,
      setupGroups,
      listReviewLeads,
      listReviewTitle,
      isListReviewOpen,
      isEditOpen,
      isPlanOpen,
      isDetailOpen,
      editingLead,
      detailLead,
      planningGroup,
      initialPlanValues,
      toast,
      readyGroups,
      retryGroups,
      newContactGroups,
      historyLeads,
      salesLeads,
      appointmentLeads,
      upcomingAppointments,
      analytics,
      setSearchTerm,
      toggleVertriebTab: () =>
        setVertriebTab((current) => (current === "hot" ? "archiv" : "hot")),
      toggleTermineTab: () =>
        setTermineTab((current) => (current === "active" ? "archiv" : "active")),
      loadDemoData,
      resetSystem,
      acceptImport,
      openStagedList,
      openGroupPreview,
      openQueuePreview,
      closeListReview: () => setIsListReviewOpen(false),
      openLeadEditor,
      closeLeadEditor,
      saveLead,
      deleteEditingLead,
      openDetail,
      closeDetail,
      openPlan,
      openPlanForQueue,
      closePlan,
      savePlan,
      startRun,
      exportSalesCsv,
      exportBranchCsv,
      exportAllCsv,
      markSalesDone,
    }),
    [
      acceptImport,
      analytics,
      appointmentLeads,
      closeDetail,
      closeLeadEditor,
      closePlan,
      currentCallId,
      deleteEditingLead,
      detailLead,
      editingLead,
      exportAllCsv,
      exportBranchCsv,
      exportSalesCsv,
      historyLeads,
      isDetailOpen,
      isEditOpen,
      isListReviewOpen,
      isPlanOpen,
      leads,
      listReviewLeads,
      listReviewTitle,
      liveQueue,
      loadDemoData,
      markSalesDone,
      newContactGroups,
      openDetail,
      openGroupPreview,
      openLeadEditor,
      openPlan,
      openPlanForQueue,
      openQueuePreview,
      openStagedList,
      planningGroup,
      initialPlanValues,
      readyGroups,
      resetSystem,
      retryGroups,
      salesLeads,
      saveLead,
      savePlan,
      searchTerm,
      setupGroups,
      staged,
      startRun,
      termineTab,
      toast,
      upcomingAppointments,
      vertriebTab,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return context;
}
