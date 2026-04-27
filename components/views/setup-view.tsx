"use client";

import { CampaignGroupSection } from "@/components/setup/campaign-group-section";
import { ImportActions } from "@/components/setup/import-actions";
import { StagedImportCard } from "@/components/setup/staged-import-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { SetupLeadGroup } from "@/types/setup";

export function SetupView() {
  const {
    staged,
    readyGroups,
    retryGroups,
    newContactGroups,
    openLeadEditor,
    loadDemoData,
    acceptImport,
    openStagedList,
    openGroupPreview,
    openPlan,
    leads,
    liveQueue,
    startRun,
  } = useDashboard();

  const allGroups = [...readyGroups, ...retryGroups, ...newContactGroups];

  function handleStart(group: SetupLeadGroup) {
    const ids =
      group.kind === "ready"
        ? leads.filter((lead) => lead.branch === group.name && lead.status === "wait")
        : group.kind === "retry"
          ? leads.filter((lead) => lead.branch === group.name && lead.status === "not_reached")
          : leads.filter((lead) => lead.branch === group.name && lead.status === "not_responsible");
    startRun(
      ids.map((lead) => lead.id),
      group.kind === "ready"
        ? group.name
        : group.kind === "retry"
          ? `2. Versuch: ${group.name}`
          : `Neue AP: ${group.name}`,
    );
  }

  return (
    <section className="view active">
      <div className="setup-desktop-grid">
        <div className="setup-sidebar">
          <SectionTitle icon="fa-solid fa-1" title="Import & Erfassung" />

          <ImportActions onManualAdd={() => openLeadEditor()} onCsvImport={loadDemoData} />

          <StagedImportCard
            stagedCount={staged.length}
            isPreviewOpen={false}
            onPreviewToggle={openStagedList}
            onAcceptImport={acceptImport}
          />
        </div>

        <div className="campaign-column">
          <SectionTitle icon="fa-solid fa-layer-group" title="Startklar" />

          {readyGroups.map((group) => (
            <CampaignGroupSection
              icon="fa-solid fa-layer-group"
              title=""
              groups={[group]}
              key={group.id}
              onPreviewOpen={openGroupPreview}
              onPlanOpen={openPlan}
              onStart={handleStart}
            />
          ))}

          <CampaignGroupSection
            icon="fa-solid fa-phone-slash"
            title="Nicht erreicht"
            groups={retryGroups}
            className="sub-group"
            onPreviewOpen={openGroupPreview}
            onPlanOpen={openPlan}
            onStart={handleStart}
          />

          <CampaignGroupSection
            icon="fa-solid fa-users-viewfinder"
            title="Neue Ansprechpartner"
            groups={newContactGroups}
            className="sub-group"
            onPreviewOpen={openGroupPreview}
            onPlanOpen={openPlan}
            onStart={handleStart}
          />

          {allGroups.length === 0 ? (
            <EmptyState
              icon="fa-solid fa-layer-group"
              text="Lade Leads hoch oder erstelle sie manuell, um Outbound-Kampagnen zu starten."
            />
          ) : null}

          {(leads.length > 0 || staged.length > 0 || liveQueue.length > 0) && allGroups.length === 0 ? (
            <div className="card side-note-card">
              <strong>Aktueller Stand</strong>
              <p>{leads.length} Leads im System</p>
              <p>{staged.length} Leads im Import-Staging</p>
              <p>{liveQueue.length} aktive oder geplante Durchläufe</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
