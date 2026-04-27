"use client";

import { LeadDetailSheet } from "@/components/overlays/lead-detail-sheet";
import { AppShell } from "@/components/layout/app-shell";
import { ListReviewSheet } from "@/components/setup/list-review-sheet";
import { LeadEditSheet } from "@/components/setup/lead-edit-sheet";
import { PlanRunSheet } from "@/components/setup/plan-run-sheet";
import { Toast } from "@/components/ui/toast";
import { DashboardProvider, useDashboard } from "@/hooks/use-dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const {
    toast,
    isListReviewOpen,
    listReviewTitle,
    listReviewLeads,
    closeListReview,
    openLeadEditor,
    isEditOpen,
    editingLead,
    closeLeadEditor,
    saveLead,
    deleteEditingLead,
    isPlanOpen,
    planningGroup,
    closePlan,
    savePlan,
    isDetailOpen,
    detailLead,
    closeDetail,
  } = useDashboard();

  return (
    <>
      <AppShell>{children}</AppShell>
      <Toast message={toast?.message ?? ""} icon={toast?.icon ?? "fa-circle-info"} visible={Boolean(toast)} />
      <ListReviewSheet
        isOpen={isListReviewOpen}
        title={listReviewTitle}
        leads={listReviewLeads}
        onClose={closeListReview}
        onLeadClick={(lead) => openLeadEditor(lead)}
      />
      <LeadEditSheet
        isOpen={isEditOpen}
        lead={editingLead}
        onClose={closeLeadEditor}
        onSave={saveLead}
        onDelete={deleteEditingLead}
      />
      <PlanRunSheet
        isOpen={isPlanOpen}
        title={planningGroup ? `Anrufe planen: ${planningGroup.branch}` : "Anrufe planen"}
        onClose={closePlan}
        onSave={savePlan}
      />
      <LeadDetailSheet isOpen={isDetailOpen} lead={detailLead} onClose={closeDetail} />
    </>
  );
}
