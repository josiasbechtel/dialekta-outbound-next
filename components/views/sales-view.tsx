"use client";

import { useRef, useState, type TouchEvent } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { triggerHaptic } from "@/lib/feedback";
import { statusMeta } from "@/lib/dashboard-data";
import { Lead } from "@/types/dashboard";

type SwipeLeadCardProps = {
  lead: Lead;
  onOpen: () => void;
  onDone: () => void;
};

function SwipeLeadCard({ lead, onOpen, onDone }: SwipeLeadCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    swiping: false,
    scrolling: false,
  });

  function resetCard() {
    setTranslateX(0);
    setIsDragging(false);
    touchStateRef.current = {
      startX: 0,
      startY: 0,
      swiping: false,
      scrolling: false,
    };
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      swiping: false,
      scrolling: false,
    };
    setIsDragging(true);
  }

  function handleTouchMove(event: TouchEvent<HTMLElement>) {
    const state = touchStateRef.current;
    const touch = event.touches[0];
    const diffX = touch.clientX - state.startX;
    const diffY = touch.clientY - state.startY;

    if (!state.swiping && !state.scrolling) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        state.swiping = true;
      } else if (Math.abs(diffY) > 10) {
        state.scrolling = true;
      }
    }

    if (!state.swiping) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    setTranslateX(diffX);
  }

  function handleTouchEnd() {
    const state = touchStateRef.current;

    if (state.swiping && Math.abs(translateX) > 80) {
      setTranslateX(Math.sign(translateX) * 420);
      triggerHaptic(10);
      window.setTimeout(() => {
        onDone();
        resetCard();
      }, 220);
      return;
    }

    resetCard();
  }

  return (
    <div className="swipe-container">
      <div className="swipe-success-bg">
        <div>
          <i className="fa-solid fa-check" aria-hidden="true" />
          Erledigt
        </div>
        <div>
          <i className="fa-solid fa-check" aria-hidden="true" />
          Erledigt
        </div>
      </div>
      <article
        className="result-item clickable swipe-item-card"
        onClick={() => {
          if (!touchStateRef.current.swiping) {
            onOpen();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px) rotate(${translateX * 0.04}deg)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        <div className="result-topline">
          <div>
            <div className="company-text">
              <i className="fa-solid fa-building" aria-hidden="true" />
              <span>{lead.company}</span>
            </div>
            <div className="result-name-line">
              <span className="result-name">{lead.ansprechpartnerName || `${lead.firstName} ${lead.lastName}`}</span>
              <span className="result-meta">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                {lead.ansprechpartnerPhone || lead.phone}
              </span>
            </div>
          </div>
          <span className={`badge ${statusMeta[lead.status].className}`}>{statusMeta[lead.status].label}</span>
        </div>
      </article>
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
          icon={vertriebTab === "archiv" ? "fa-solid fa-archive" : "fa-solid fa-user-tie"}
          title={vertriebTab === "archiv" ? "Archiv" : "Menschliche Übergabe"}
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
            onClick={() => {
              triggerHaptic(10);
              toggleVertriebTab();
            }}
          >
            <span>Archiv</span>
            <div className={`toggle-sm ${vertriebTab === "archiv" ? "on" : ""}`} />
          </button>
        </div>
      </div>
      <p className="sub-copy">
        {vertriebTab === "archiv"
          ? "Archivierte Leads (Erledigt oder Gelöscht)."
          : "Leads mit Interesse oder Rückruf-Wunsch."}
      </p>

      {salesLeads.length === 0 ? (
        <EmptyState
          icon={vertriebTab === "archiv" ? "fa-regular fa-folder-open" : "fa-regular fa-face-smile"}
          text={vertriebTab === "archiv" ? "Keine archivierten Leads." : "Aktuell keine heissen Leads für den Vertrieb."}
        />
      ) : (
        salesLeads.map((lead) =>
          vertriebTab === "hot" ? (
            <SwipeLeadCard
              key={lead.id}
              lead={lead}
              onOpen={() => openDetail(lead.id)}
              onDone={() => markSalesDone(lead.id)}
            />
          ) : (
            <article className="result-item clickable" key={lead.id} onClick={() => openDetail(lead.id)}>
              <div className="result-topline">
                <div>
                  <div className="company-text">
                    <i className="fa-solid fa-building" aria-hidden="true" />
                    <span>{lead.company}</span>
                  </div>
                  <div className="result-name-line">
                    <span className={`result-name ${lead.status === "sales_deleted" ? "text-strike" : ""}`}>
                      {lead.ansprechpartnerName || `${lead.firstName} ${lead.lastName}`}
                    </span>
                    <span className="result-meta">
                      <i className="fa-solid fa-phone" aria-hidden="true" />
                      {lead.ansprechpartnerPhone || lead.phone}
                    </span>
                  </div>
                </div>
                <span className={`badge ${statusMeta[lead.status].className}`}>{statusMeta[lead.status].label}</span>
              </div>
            </article>
          ),
        )
      )}
    </section>
  );
}
