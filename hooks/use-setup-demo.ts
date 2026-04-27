"use client";

import { useMemo, useState } from "react";
import { setupDemoState } from "@/lib/demo-data";
import { SetupLeadGroup, StagedLead } from "@/types/setup";

type SetupDemoState = {
  stagedLeads: StagedLead[];
  groups: SetupLeadGroup[];
};

type PlanState = {
  date: string;
  timeFrom: string;
  timeTo: string;
};

export function useSetupDemo() {
  const [data, setData] = useState<SetupDemoState>(setupDemoState);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGroupPreviewOpen, setIsGroupPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SetupLeadGroup | null>(null);
  const [editingLead, setEditingLead] = useState<StagedLead | null>(null);
  const [lastSavedPlan, setLastSavedPlan] = useState<PlanState | null>(null);

  const stagedCount = data.stagedLeads.length;

  const groupedPreview = useMemo(() => {
    return data.stagedLeads.reduce<Record<string, StagedLead[]>>((acc, lead) => {
      if (!acc[lead.branch]) {
        acc[lead.branch] = [];
      }
      acc[lead.branch].push(lead);
      return acc;
    }, {});
  }, [data.stagedLeads]);

  const previewLeads = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    return data.stagedLeads.filter((lead) => {
      if (selectedGroup.kind === "ready") {
        return lead.branch === selectedGroup.name;
      }

      if (selectedGroup.kind === "retry") {
        return lead.branch === "Handwerk" || lead.branch === "IT";
      }

      return lead.branch === "Gastro" || lead.branch === "Manuell";
    });
  }, [data.stagedLeads, selectedGroup]);

  function togglePreview() {
    if (stagedCount === 0) {
      return;
    }

    setIsPreviewOpen((current) => !current);
  }

  function acceptImport() {
    if (stagedCount === 0) {
      return;
    }

    setData((current) => ({
      ...current,
      stagedLeads: [],
    }));
    setIsPreviewOpen(false);
  }

  function simulateManualLead() {
    setEditingLead(null);
    setIsEditOpen(true);
  }

  function simulateCsvImport() {
    if (stagedCount > 0) {
      setIsPreviewOpen(true);
    }
  }

  function openGroupPreview(group: SetupLeadGroup) {
    setSelectedGroup(group);
    setIsGroupPreviewOpen(true);
  }

  function closeGroupPreview() {
    setIsGroupPreviewOpen(false);
  }

  function openPlan(group: SetupLeadGroup) {
    setSelectedGroup(group);
    setIsPlanOpen(true);
  }

  function closePlan() {
    setIsPlanOpen(false);
  }

  function openLeadEditor(lead: StagedLead) {
    setEditingLead(lead);
    setIsEditOpen(true);
    setIsGroupPreviewOpen(false);
  }

  function closeLeadEditor() {
    setIsEditOpen(false);
    setEditingLead(null);
  }

  function saveLead(lead: StagedLead) {
    setData((current) => {
      const alreadyExists = current.stagedLeads.some((item) => item.id === lead.id);

      return {
        ...current,
        stagedLeads: alreadyExists
          ? current.stagedLeads.map((item) => (item.id === lead.id ? lead : item))
          : [lead, ...current.stagedLeads],
      };
    });

    setIsEditOpen(false);
    setEditingLead(null);
  }

  function savePlan(plan: PlanState) {
    setLastSavedPlan(plan);
    setIsPlanOpen(false);
  }

  return {
    groups: data.groups,
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
  };
}
