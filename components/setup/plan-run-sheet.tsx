"use client";

import { useEffect, useState } from "react";
import { SheetOverlay } from "@/components/ui/sheet-overlay";

type PlanState = {
  date: string;
  timeFrom: string;
  timeTo: string;
};

type PlanRunSheetProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onSave: (plan: PlanState) => void;
};

function getTodayValue() {
  return new Date().toISOString().split("T")[0];
}

export function PlanRunSheet({ isOpen, title, onClose, onSave }: PlanRunSheetProps) {
  const [plan, setPlan] = useState<PlanState>({
    date: getTodayValue(),
    timeFrom: "09:00",
    timeTo: "12:00",
  });

  useEffect(() => {
    if (isOpen) {
      setPlan({
        date: getTodayValue(),
        timeFrom: "09:00",
        timeTo: "12:00",
      });
    }
  }, [isOpen]);

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={title ?? "Anrufe planen"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-primary" type="button" onClick={() => onSave(plan)}>
            <i className="fa-solid fa-calendar-check" aria-hidden="true" />
            Speichern
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Datum</label>
        <input
          className="input"
          type="date"
          min={getTodayValue()}
          value={plan.date}
          onChange={(event) => setPlan((current) => ({ ...current, date: event.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Von (Uhrzeit)</label>
          <input
            className="input"
            type="time"
            value={plan.timeFrom}
            onChange={(event) =>
              setPlan((current) => ({ ...current, timeFrom: event.target.value }))
            }
          />
        </div>
        <div className="form-group form-group-last">
          <label>Bis (Uhrzeit)</label>
          <input
            className="input"
            type="time"
            value={plan.timeTo}
            onChange={(event) =>
              setPlan((current) => ({ ...current, timeTo: event.target.value }))
            }
          />
        </div>
      </div>
    </SheetOverlay>
  );
}
