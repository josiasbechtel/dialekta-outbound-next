"use client";

import { useEffect, useState } from "react";
import { SheetOverlay } from "@/components/ui/sheet-overlay";
import { StagedLead } from "@/types/setup";

type LeadEditSheetProps = {
  isOpen: boolean;
  lead: StagedLead | null;
  onClose: () => void;
  onSave: (lead: StagedLead) => void;
};

const emptyLead: StagedLead = {
  id: "",
  company: "",
  firstName: "",
  lastName: "",
  phone: "+41 ",
  email: "",
  website: "",
  location: "",
  branch: "",
  notes: "",
};

export function LeadEditSheet({ isOpen, lead, onClose, onSave }: LeadEditSheetProps) {
  const [form, setForm] = useState<StagedLead>(emptyLead);

  useEffect(() => {
    setForm(lead ?? emptyLead);
  }, [lead, isOpen]);

  function updateField<K extends keyof StagedLead>(key: K, value: StagedLead[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    onSave({
      ...form,
      id: form.id || `manual-${Date.now()}`,
      company: form.company || "Unbekannt",
    });
  }

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={lead?.id ? "Lead bearbeiten" : "Lead hinzufügen"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSave}>
            <i className="fa-solid fa-check" aria-hidden="true" />
            Speichern
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Firma</label>
        <input
          className="input"
          type="text"
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder="Firmenname"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Vorname</label>
          <input
            className="input"
            type="text"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Nachname</label>
          <input
            className="input"
            type="text"
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Telefon</label>
          <input
            className="input"
            type="text"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>E-Mail</label>
          <input
            className="input"
            type="email"
            value={form.email ?? ""}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Webseite</label>
        <input
          className="input"
          type="url"
          value={form.website ?? ""}
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="www.beispiel.ch"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Ort</label>
          <input
            className="input"
            type="text"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Branche</label>
          <input
            className="input"
            type="text"
            value={form.branch}
            onChange={(event) => updateField("branch", event.target.value)}
          />
        </div>
      </div>
      <div className="form-group form-group-last">
        <label>Notizen / Hintergrundinfos</label>
        <textarea
          className="input"
          rows={3}
          value={form.notes ?? ""}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Spezielle Infos für den Anruf oder Vertrieb..."
        />
      </div>
    </SheetOverlay>
  );
}
