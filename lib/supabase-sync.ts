import { supabase } from "@/lib/supabase-client";
import { Lead, LiveQueue } from "@/types/dashboard";
import { StagedLead } from "@/types/setup";

type DashboardSnapshot = {
  leads: Lead[];
  staged: StagedLead[];
  liveQueue: LiveQueue[];
  currentCallId: string | null;
};

function toStagedRow(lead: StagedLead) {
  return {
    id: lead.id,
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
    company: row.company,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    location: row.location,
    branch: row.branch,
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
    status: row.status,
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

async function clearTable(table: string) {
  const result = await supabase!.from(table).delete().not("id", "is", null);
  if (result.error) throw result.error;
}

export async function loadDashboardState(): Promise<DashboardSnapshot | null> {
  if (!supabase) return null;

  const [leadsResult, stagedResult, queuesResult, queueLeadsResult, settingsResult] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: true }),
    supabase.from("staged_leads").select("*").order("created_at", { ascending: true }),
    supabase.from("live_queues").select("*").order("created_at", { ascending: true }),
    supabase.from("live_queue_leads").select("queue_id, lead_id, position").order("position", { ascending: true }),
    supabase.from("dashboard_settings").select("current_call_id").eq("id", "default").maybeSingle(),
  ]);

  const firstError = leadsResult.error ?? stagedResult.error ?? queuesResult.error ?? queueLeadsResult.error ?? settingsResult.error;
  if (firstError) throw firstError;

  const queueLeadMap = new Map<string, string[]>();
  (queueLeadsResult.data ?? []).forEach((row: any) => {
    const ids = queueLeadMap.get(row.queue_id) ?? [];
    ids.push(row.lead_id);
    queueLeadMap.set(row.queue_id, ids);
  });

  return {
    leads: (leadsResult.data ?? []).map(fromLeadRow),
    staged: (stagedResult.data ?? []).map(fromStagedRow),
    liveQueue: (queuesResult.data ?? []).map((row: any) => ({
      id: row.id,
      branch: row.branch,
      ids: queueLeadMap.get(row.id) ?? [],
      total: row.total,
      isPlanned: row.is_planned,
      planDate: row.plan_date,
      planFrom: row.plan_from,
      planTo: row.plan_to,
      planTimestamp: row.plan_timestamp ?? 0,
    })),
    currentCallId: settingsResult.data?.current_call_id ?? null,
  };
}

export async function saveDashboardState(snapshot: DashboardSnapshot) {
  if (!supabase) return;

  const settings = await supabase.from("dashboard_settings").upsert({
    id: "default",
    current_call_id: snapshot.currentCallId,
    updated_at: new Date().toISOString(),
  });
  if (settings.error) throw settings.error;

  await clearTable("live_queue_leads");
  await clearTable("live_queues");
  await clearTable("leads");
  await clearTable("staged_leads");

  if (snapshot.leads.length > 0) {
    const result = await supabase.from("leads").insert(snapshot.leads.map(toLeadRow));
    if (result.error) throw result.error;
  }

  if (snapshot.staged.length > 0) {
    const result = await supabase.from("staged_leads").insert(snapshot.staged.map(toStagedRow));
    if (result.error) throw result.error;
  }

  if (snapshot.liveQueue.length > 0) {
    const queueResult = await supabase.from("live_queues").insert(
      snapshot.liveQueue.map((queue) => ({
        id: queue.id,
        branch: queue.branch,
        total: queue.total,
        is_planned: queue.isPlanned,
        plan_date: queue.planDate,
        plan_from: queue.planFrom,
        plan_to: queue.planTo,
        plan_timestamp: queue.planTimestamp,
      })),
    );
    if (queueResult.error) throw queueResult.error;
  }

  const junctionRows = snapshot.liveQueue.flatMap((queue) =>
    queue.ids.map((leadId, position) => ({
      id: `${queue.id}-${leadId}`,
      queue_id: queue.id,
      lead_id: leadId,
      position,
    })),
  );

  if (junctionRows.length > 0) {
    const result = await supabase.from("live_queue_leads").insert(junctionRows);
    if (result.error) throw result.error;
  }
}
