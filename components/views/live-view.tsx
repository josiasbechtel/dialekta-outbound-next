"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";

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
        <EmptyState icon="fa-solid fa-headset" text="Aktuell läuft kein automatischer Durchlauf." />
      </section>
    );
  }

  return (
    <section className="view active">
      <SectionTitle icon="fa-solid fa-satellite-dish" title="Automatischer Durchlauf" />

      {orderedQueues.map((queue) => {
        const doneCount = queue.ids.filter((id) => {
          const lead = leads.find((item) => item.id === id);
          return lead && !["wait", "calling"].includes(lead.status);
        }).length;
        const pct = queue.total > 0 ? Math.round((doneCount / queue.total) * 100) : 0;
        const activeLead = leads.find((lead) => lead.id === currentCallId && queue.ids.includes(lead.id));

        return (
          <article
            key={queue.id}
            className={`live-run-card ${activeLead ? "active-run" : "queued-run"}`}
          >
            <div className="run-header">
              <div className="run-header-top">
                <div className="run-title">
                  <i className="fa-solid fa-layer-group" aria-hidden="true" />
                  <span>{queue.branch}</span>
                </div>
                <span className="progress-text">
                  {doneCount} / {queue.total} erledigt
                </span>
              </div>
              <div className="mini-bar-track">
                <div className="mini-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="run-body">
              {activeLead ? (
                <>
                  <div className="call-name">
                    {activeLead.company} • {activeLead.firstName} {activeLead.lastName}
                  </div>
                  <a className="call-btn-action" href={`tel:${activeLead.phone.replace(/\s/g, "")}`}>
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    <span>{activeLead.phone}</span>
                  </a>
                </>
              ) : queue.isPlanned && queue.planDate ? (
                <button className="queue-plan-btn" type="button" onClick={() => openPlanForQueue(queue.id)}>
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                  Geplant: {queue.planDate} {queue.planFrom}-{queue.planTo}
                </button>
              ) : (
                <div className="call-name">Wartet in Schlange</div>
              )}

              <div className="queue-card-actions">
                <button className="btn btn-outline" type="button" onClick={() => openQueuePreview(queue.id)}>
                  <i className="fa-solid fa-list-ul" aria-hidden="true" />
                  Liste
                </button>
                {!activeLead ? (
                  <button className="btn btn-outline" type="button" onClick={() => openPlanForQueue(queue.id)}>
                    <i className="fa-solid fa-pen" aria-hidden="true" />
                    Planung
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
