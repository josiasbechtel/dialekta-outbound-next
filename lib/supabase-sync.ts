import { supabase } from "@/lib/supabase-client";
import { Lead, LiveQueue } from "@/types/dashboard";
import { StagedLead } from "@/types/setup";

type DashboardSnapshot = {
  leads: Lead[];
  staged: StagedLead[];
  liveQueue: LiveQueue[];
  currentCallId: string | null;
};

const DEFAULT_IMPORT_BATCH_ID = "00000000-0000-0000-0000-000000000001";
const SIMULATION_PREFIXES = ["simulation-", "demo-"];

function isSimulationId(id: string) {
  return SIMULATION_PREFIXES.some((prefix) => id.startsWith(prefix));
}

function toStagedRow(lead: StagedLead) {
  return {
    id: lead.id,
    import_batch_id: DEFAULT_IMPORT_BATCH_ID,
    external_row_number: null,
    company: lead.company,
    first_name: lead.firstName,
    last_name: lead.lastName,
    phone: lead.phone,
    email: lead.email ?? null,
    website: lead.website ?? null,
    location: lead.location,
    branch: lead.branch,
    notes: lead.notes ?? null,
  };
}

function fromStagedRow(row: any): StagedLead {
  return {
    id: row.id,
    company: row.company ?? "",
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    location: row.location ?? "",
    branch: row.branch ?? "Manuell",
    notes: row.notes ?? undefined,
  };
}

function toLeadRow(lead: Lead) {
  return {
    ...toStagedRow(lead),
    status: lead.status,
    plan_info: lead.planInfo,
    plan_timestamp: lead.planTimestamp,
    action_ts: lead.actionTs,
    summary: lead.summary,
    appointment_date: lead.appointmentDate,
    appointment_context: lead.appointmentContext,
    ansprechpartner_name: lead.ansprechpartnerName,
    ansprechpartner_phone: lead.ansprechpartnerPhone,
    ansprechpartner_role: lead.ansprechpartnerRole,
    prev_status: lead.prevStatus ?? null,
  };
}

function fromLeadRow(row: any): Lead {
  return {
    ...fromStagedRow(row),
    status: row.status ?? "wait",
    planInfo: row.plan_info,
    planTimestamp: row.plan_timestamp ?? 0,
    actionTs: row.action_ts ?? 0,
    summary: row.summary,
    appointmentDate: row.appointment_date,
    appointmentContext: row.appointment_context,
    ansprechpartnerName: row.ansprechpartner_name,
    ansprechpartnerPhone: row.ansprechpartner_phone,
    ansprechpartnerRole: row.ansprechpartner_role,
    prevStatus: row.prev_status ?? undefined,
  };
}

async function deleteMissingRows(table: string, existingIds: string[], currentIds: string[]) {
  const idsToDelete = existingIds.filter((id) => !currentIds.includes(id));
  if (idsToDelete.length === 0) return;

  const result = await supabase!.from(table).delete().in("id", idsToDelete);
  if (result.error) throw result.error;
}

async function ensureImportBatch() {
  const result = await supabase!.from("import_batches").upsert({
    id: DEFAULT_IMPORT_BATCH_ID,
    name: "Dashboard Import",
    source: "app",
    row_count: 0,
    updated_at: new Date().toISOString(),
  });
  if (result.error) throw result.error;
}

export async function startLeadOutboundManually(leadId: string) {
  if (!supabase) return null;

  const result = await supabase.rpc("start_lead_outbound_manually", {
    p_lead_id: leadId,
  });

  if (result.error) throw result.error;
  return result.data as number | null;
}

export async function loadDashboardState(): Promise<DashboardSnapshot | null> {
  if (!supabase) return null;

  const [leadsResult, stagedResult, runsResult, runLeadsResult] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: true }),
    supabase.from("staged_leads").select("*").order("created_at", { ascending: true }),
    supabase.from("call_runs").select("*").order("created_at", { ascending: true }),
    supabase.from("call_run_leads").select("call_run_id, lead_id, position").order("position", { ascending: true }),
  ]);

  const firstError = leadsResult.error ?? stagedResult.error ?? runsResult.error ?? runLeadsResult.error;
  if (firstError) throw firstError;

  const runLeadMap = new Map<string, string[]>();
  (runLeadsResult.data ?? []).forEach((row: any) => {
    const ids = runLeadMap.get(row.call_run_id) ?? [];
    ids.push(row.lead_id);
    runLeadMap.set(row.call_run_id, ids);
  });

  return {
    leads: (leadsResult.data ?? []).map(fromLeadRow),
    staged: (stagedResult.data ?? []).map(fromStagedRow),
    liveQueue: (runsResult.data ?? []).map((row: any) => ({
      id: row.id,
      branch: row.branch,
      ids: runLeadMap.get(row.id) ?? [],
      total: row.total,
      isPlanned: row.is_planned,
      planDate: row.plan_date,
      planFrom: row.plan_from,
      planTo: row.plan_to,
      planTimestamp: row.plan_timestamp ?? 0,
    })),
    currentCallId: null,
  };
}

export async function saveDashboardState(snapshot: DashboardSnapshot) {
  if (!supabase) return;

  await ensureImportBatch();

  const stagedToPersist = snapshot.staged.filter((lead) => !isSimulationId(lead.id));
  const leadsToPersist = snapshot.leads.filter((lead) => !isSimulationId(lead.id));

  const existingStagedResult = await supabase.from("staged_leads").select("id");
  if (existingStagedResult.error) throw existingStagedResult.error;

  await deleteMissingRows(
    "staged_leads",
    (existingStagedResult.data ?? []).map((row: any) => row.id),
    stagedToPersist.map((lead) => lead.id),
  );

  if (stagedToPersist.length > 0) {
    const result = await supabase.from("staged_leads").upsert(stagedToPersist.map(toStagedRow));
    if (result.error) throw result.error;
  }

  if (leadsToPersist.length > 0) {
    const result = await supabase.from("leads").upsert(leadsToPersist.map(toLeadRow));
    if (result.error) throw result.error;
  }

  if (snapshot.liveQueue.length > 0) {
    const runResult = await supabase.from("call_runs").upsert(
      snapshot.liveQueue.map((queue) => ({
        id: queue.id,
        branch: queue.branch,
        total: queue.total,
        is_planned: queue.isPlanned,
        plan_date: queue.planDate,
        plan_from: queue.planFrom,
        plan_to: queue.planTo,
        plan_timestamp: queue.planTimestamp,
        current_call_id: snapshot.currentCallId,
      })),
    );
    if (runResult.error) throw runResult.error;

    const junctionRows = snapshot.liveQueue.flatMap((queue) =>
      queue.ids.map((leadId, position) => ({
        id: `${queue.id}-${leadId}`,
        call_run_id: queue.id,
        lead_id: leadId,
        position,
      })),
    );

    if (junctionRows.length > 0) {
      const result = await supabase.from("call_run_leads").upsert(junctionRows);
      if (result.error) throw result.error;
    }
  }

  const appointmentRows = leadsToPersist
    .filter((lead) => lead.status === "appointment" && lead.appointmentDate)
    .map((lead) => ({
      id: `appointment-${lead.id}`,
      lead_id: lead.id,
      appointment_date: lead.appointmentDate,
      context: lead.appointmentContext,
      summary: lead.summary,
    }));

  if (appointmentRows.length > 0) {
    const result = await supabase.from("appointments").upsert(appointmentRows);
    if (result.error) throw result.error;
  }
}
