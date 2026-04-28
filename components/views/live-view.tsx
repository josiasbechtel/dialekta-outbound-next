"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";

function formatPlanDate(value: string | null) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.`;
}

function queueLabel(branch: string) {
  const lower = branch.toLowerCase();
  if (lower.includes("2. versuch")) return branch;
  if (lower.includes("retry")) return branch.replace(/retry/gi, "2. Versuch");
  return branch;
}

export function LiveView() {
  const { liveQueue, leads, currentCallId, openQueuePreview, openPlanForQueue } = useDashboard();

  const activeQueue = liveQueue.find((queue) => !queue.isPlanned || queue.planTimestamp <= Date.now()) ?? null;
  const orderedQueues = activeQueue
    ? [activeQueue, ...liveQueue.filter((queue) => queue.id !== activeQueue.id)]
    : liveQueue;

  if (liveQueue.length === 0) {
    return (
      <section className="view active">
        <SectionTitle icon="fa-solid fa-satellite-dish" title="Automatischer Durchlauf" />
        <p className="sub-copy live-sub-copy">Die KI arbeitet im Hintergrund. Lehne dich zurück.</p>
        <EmptyState icon="fa-solid fa-headset" text="Aktuell läuft kein Durchlauf. Starte Kampagnen im Setup." />
      </section>
    );
  }

  return (
    <section className="view active">
      <SectionTitle icon="fa-solid fa-satellite-dish" title="Automatischer Durchlauf" />
      <p className="sub-copy live-sub-copy">Die KI arbeitet im Hintergrund. Lehne dich zurück.</p>

      <div className="live-queue-stack">
        {orderedQueues.map((queue) => {
          const doneCount = queue.ids.filter((id) => {
            const lead = leads.find((item) => item.id === id);
            return lead && !["wait", "calling"].includes(lead.status);
          }).length;
          const pct = queue.total > 0 ? Math.round((doneCount / queue.total) * 100) : 0;
          const isRunnable = !queue.isPlanned || queue.planTimestamp <= Date.now();
          const activeLead = leads.find((lead) => lead.id === currentCallId && queue.ids.includes(lead.id));
          const isActive = Boolean(isRunnable && activeLead);
          const displayName = activeLead?.ansprechpartnerName ||
            (activeLead ? `${activeLead.firstName} ${activeLead.lastName}`.trim() || "Allgemeiner Kontakt" : "");
          const displayPhone = activeLead?.ansprechpartnerPhone || activeLead?.phone || "";
          const previousContact = activeLead?.ansprechpartnerName
            ? `${activeLead.firstName} ${activeLead.lastName}`.trim()
            : "";

          return (
            <article
              key={queue.id}
              className={`live-run-card ${isActive ? "active-run" : "queued-run"}`}
            >
              <div className="run-header">
                <div className="run-header-top">
                  <div className="run-title-block">
                    <span className="run-kicker">AKTUELLE KAMPAGNE</span>
                    <div className="run-title">
                      <i className="fa-solid fa-layer-group" aria-hidden="true" />
                      <span>{queueLabel(queue.branch)}</span>
                    </div>
                  </div>
                  <div className="run-header-actions">
                    <span className="progress-text">{doneCount} / {queue.total} erledigt</span>
                    <button
                      className="queue-list-icon-btn"
                      type="button"
                      onClick={() => openQueuePreview(queue.id)}
                      aria-label="Leads anzeigen"
                    >
                      <i className="fa-solid fa-list-ul" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="run-body">
                {isActive && activeLead ? (
                  <div className="active-call-panel">
                    <div className="active-call-status">
                      <i className="fa-solid fa-phone-volume fa-shake" aria-hidden="true" />
                      <span>Agent ruft an...</span>
                      <div className="sound-wave-mini" aria-hidden="true">
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                      </div>
                    </div>

                    <div className="call-context-pills">
                      <span className="call-context-pill call-company">
                        <i className="fa-solid fa-building" aria-hidden="true" />
                        {activeLead.company}
                      </span>
                      {activeLead.location ? (
                        <span className="call-context-pill call-location">
                          <i className="fa-solid fa-location-dot" aria-hidden="true" />
                          {activeLead.location}
                        </span>
                      ) : null}
                    </div>

                    <div className="call-person-line">
                      <span>
                        <i className="fa-regular fa-user" aria-hidden="true" />
                        {displayName}
                      </span>
                      {displayPhone ? (
                        <span>
                          <i className="fa-solid fa-phone" aria-hidden="true" />
                          {displayPhone}
                        </span>
                      ) : null}
                    </div>
                    {previousContact ? (
                      <details className="call-previous-contact">
                        <summary>Ursprüngliche Ansprechperson</summary>
                        <span>{previousContact} war nicht zuständig</span>
                      </details>
                    ) : null}
                  </div>
                ) : queue.isPlanned && queue.planDate ? (
                  <button className="queue-plan-btn" type="button" onClick={() => openPlanForQueue(queue.id)}>
                    <i className="fa-regular fa-clock" aria-hidden="true" />
                    Geplant: {formatPlanDate(queue.planDate)}, {queue.planFrom}-{queue.planTo} Uhr
                    <i className="fa-solid fa-pen" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="queue-waiting-label">
                    <i className="fa-solid fa-hourglass-half" aria-hidden="true" />
                    Wartet in Schlange
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
