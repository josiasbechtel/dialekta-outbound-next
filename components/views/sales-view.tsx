"use client";

import { useRef, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { statusMeta } from "@/lib/dashboard-data";
import { LeadContactCardLines, hasReplacementContact } from "@/components/shared/lead-contact-card-lines";
import { Lead } from "@/types/dashboard";

type SalesLeadCardProps = {
  lead: Lead;
  isHot: boolean;
  onOpen: () => void;
  onDone: () => void;
};

function SalesLeadCard({ lead, isHot, onOpen, onDone }: SalesLeadCardProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number; active: boolean; swiping: boolean; scrolling: boolean }>({
    x: 0,
    y: 0,
    active: false,
    swiping: false,
    scrolling: false,
  });
  const suppressClickRef = useRef(false);
  const dragXRef = useRef(0);
  const replacement = hasReplacementContact(lead);

  const resetSwipe = () => {
    setIsDragging(false);
    dragXRef.current = 0;
    setDragX(0);
    startRef.current = { x: 0, y: 0, active: false, swiping: false, scrolling: false };
  };

  const finishSwipe = () => {
    const currentX = dragXRef.current;
    if (Math.abs(currentX) > 84) {
      suppressClickRef.current = true;
      setIsDragging(false);
      setDragX(Math.sign(currentX) * 520);
      window.setTimeout(() => {
        onDone();
        resetSwipe();
      }, 240);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 520);
      return;
    }
    resetSwipe();
  };

  const card = (
    <article
      className={`result-item sales-lead-card clickable ${replacement ? "result-item-new-ap" : ""} ${isHot ? "swipe-item" : ""}`}
      style={isHot ? { transform: `translateX(${dragX}px) rotate(${dragX * 0.035}deg)` } : undefined}
      onClick={() => {
        if (suppressClickRef.current || Math.abs(dragX) > 8) return;
        onOpen();
      }}
      onPointerDown={(event) => {
        if (!isHot) return;
        if ((event.target as HTMLElement).closest("button, a")) return;
        startRef.current = {
          x: event.clientX,
          y: event.clientY,
          active: true,
          swiping: false,
          scrolling: false,
        };
        setIsDragging(true);
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!isHot || !startRef.current.active) return;
        const diffX = event.clientX - startRef.current.x;
        const diffY = event.clientY - startRef.current.y;

        if (!startRef.current.swiping && !startRef.current.scrolling) {
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            startRef.current.swiping = true;
            suppressClickRef.current = true;
          } else if (Math.abs(diffY) > 10) {
            startRef.current.scrolling = true;
          }
        }

        if (startRef.current.swiping) {
          event.preventDefault();
          const nextX = Math.max(-180, Math.min(180, diffX));
          dragXRef.current = nextX;
          setDragX(nextX);
        }
      }}
      onPointerUp={() => {
        if (!isHot || !startRef.current.active) return;
        finishSwipe();
      }}
      onPointerCancel={resetSwipe}
    >
      <div className="result-topline">
        <div>
          <div className="company-text">
            <i className="fa-solid fa-building" aria-hidden="true" />
            <span>{lead.company}</span>
          </div>
          <LeadContactCardLines lead={lead} strikeName={lead.status === "sales_deleted"} />
        </div>
        <span className={`badge ${replacement ? "badge-new-ap" : statusMeta[lead.status].className}`}>
          {replacement ? "NEUE AP" : statusMeta[lead.status].label}
        </span>
      </div>
    </article>
  );

  if (!isHot) return card;

  return (
    <div className={`swipe-container ${isDragging ? "is-dragging" : ""}`}>
      <div className="swipe-bg" aria-hidden="true">
        <span>
          <i className="fa-solid fa-check" />
          Erledigt
        </span>
        <span>
          Erledigt
          <i className="fa-solid fa-check" />
        </span>
      </div>
      {card}
    </div>
  );
}

export function SalesView() {
  const {
    salesLeads,
    vertriebTab,
    toggleVertriebTab,
    exportSalesCsv,
    openDetail,
    markSalesDone,
  } = useDashboard();

  return (
    <section className="view active">
      <div className="header-row">
        <SectionTitle
          icon={vertriebTab === "archiv" ? "fa-solid fa-archive" : "fa-solid fa-user-check"}
          title={vertriebTab === "archiv" ? "Archiv" : "Für Vertrieb vorbereitet"}
        />
        <div className="header-action-row">
          {vertriebTab === "hot" ? (
            <button className="btn btn-outline compact-btn" type="button" onClick={exportSalesCsv}>
              <i className="fa-solid fa-download" aria-hidden="true" />
              CSV
            </button>
          ) : null}
          <button
            className={`fbb-toggle ${vertriebTab === "archiv" ? "active" : ""}`}
            type="button"
            onClick={toggleVertriebTab}
          >
            <span>Archiv</span>
            <div className={`toggle-sm ${vertriebTab === "archiv" ? "on" : ""}`} />
          </button>
        </div>
      </div>
      <p className="sub-copy">
        {vertriebTab === "archiv"
          ? "Bereits erledigte oder entfernte Vertriebsleads."
          : "Leads mit Interesse oder Rückruf-Wunsch. Öffne einen Lead für Details oder wische die Karte, um ihn als erledigt zu markieren."}
      </p>

      {salesLeads.length === 0 ? (
        <EmptyState
          icon={vertriebTab === "archiv" ? "fa-regular fa-folder-open" : "fa-regular fa-face-smile"}
          text={vertriebTab === "archiv" ? "Kein Vertriebsarchiv vorhanden." : "Aktuell keine vorbereiteten Leads für den Vertrieb."}
        />
      ) : (
        salesLeads.map((lead) => (
          <SalesLeadCard
            key={lead.id}
            lead={lead}
            isHot={vertriebTab === "hot"}
            onOpen={() => openDetail(lead.id)}
            onDone={() => markSalesDone(lead.id)}
          />
        ))
      )}
    </section>
  );
}
