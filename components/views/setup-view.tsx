"use client";

import { CampaignGroupSection } from "@/components/setup/campaign-group-section";
import { ImportActions } from "@/components/setup/import-actions";
import { LeadEditSheet } from "@/components/setup/lead-edit-sheet";
import { ListReviewSheet } from "@/components/setup/list-review-sheet";
import { PlanRunSheet } from "@/components/setup/plan-run-sheet";
import { StagedImportCard } from "@/components/setup/staged-import-card";
import { StagedPreviewPanel } from "@/components/setup/staged-preview-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useSetupDemo } from "@/hooks/use-setup-demo";

export function SetupView() {
  const {
    groups,
    groupedPreview,
    previewLeads,
    selectedGroup,
    editingLead,
    lastSavedPlan,
    isPreviewOpen,
    isGroupPreviewOpen,
    isEditOpen,
    isPlanOpen,
    stagedCount,
    togglePreview,
    acceptImport,
    simulateManualLead,
    simulateCsvImport,
    openGroupPreview,
    closeGroupPreview,
    openPlan,
    closePlan,
    openLeadEditor,
    closeLeadEditor,
    saveLead,
    savePlan,
  } = useSetupDemo();

  const readyGroups = groups.filter((group) => group.kind === "ready");
  const retryGroups = groups.filter((group) => group.kind === "retry");
  const newContactGroups = groups.filter((group) => group.kind === "new-contact");

  return (
    <section className="view active">
      <div className="setup-desktop-grid">
        <div>
          <SectionTitle icon="fa-solid fa-1" title="Import & Erfassung" />

          <ImportActions onManualAdd={simulateManualLead} onCsvImport={simulateCsvImport} />

          <StagedImportCard
            stagedCount={stagedCount}
            isPreviewOpen={isPreviewOpen}
            onPreviewToggle={togglePreview}
            onAcceptImport={acceptImport}
          />

          {isPreviewOpen ? <StagedPreviewPanel groupedPreview={groupedPreview} /> : null}

          <CampaignGroupSection
            icon="fa-solid fa-layer-group"
            title="Startklar"
            groups={readyGroups}
            onPreviewOpen={openGroupPreview}
            onPlanOpen={openPlan}
          />

          <CampaignGroupSection
            icon="fa-solid fa-phone-slash"
            title="Nicht erreicht"
            groups={retryGroups}
            className="sub-group"
            onPreviewOpen={openGroupPreview}
            onPlanOpen={openPlan}
          />

          <CampaignGroupSection
            icon="fa-solid fa-users-viewfinder"
            title="Neue Ansprechpartner"
            groups={newContactGroups}
            className="sub-group"
            onPreviewOpen={openGroupPreview}
            onPlanOpen={openPlan}
          />
        </div>

        <aside className="desktop-side-panel">
          <SectionTitle icon="fa-solid fa-layer-group" title="Übersicht" />
          <EmptyState
            icon="fa-solid fa-circle-info"
            text="Die Setup-Ansicht ist jetzt in React-Bausteine geschnitten. Import-Review, Gruppenkarten und Aktionen können dadurch ohne Designbruch an echte Backend-Logik angeschlossen werden."
          />
          {lastSavedPlan ? (
            <div className="card side-note-card">
              <strong>Letzte Planung</strong>
              <p>
                {lastSavedPlan.date} von {lastSavedPlan.timeFrom} bis {lastSavedPlan.timeTo}
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      <ListReviewSheet
        isOpen={isGroupPreviewOpen}
        title={selectedGroup ? selectedGroup.name : "Liste prüfen"}
        leads={previewLeads}
        onClose={closeGroupPreview}
        onLeadClick={openLeadEditor}
      />

      <LeadEditSheet
        isOpen={isEditOpen}
        lead={editingLead}
        onClose={closeLeadEditor}
        onSave={saveLead}
      />

      <PlanRunSheet
        isOpen={isPlanOpen}
        title={selectedGroup ? `Anrufe planen: ${selectedGroup.name}` : "Anrufe planen"}
        onClose={closePlan}
        onSave={savePlan}
      />
    </section>
  );
}
