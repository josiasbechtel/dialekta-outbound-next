import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { liveQueueDemo } from "@/lib/demo-data";

export function LiveView() {
  return (
    <section className="view active">
      <SectionTitle icon="fa-solid fa-satellite-dish" title="Automatischer Durchlauf" />

      {liveQueueDemo.map((run, index) => (
        <article
          key={run.title}
          className={`live-run-card ${index === 0 ? "active-run" : "queued-run"}`}
        >
          <div className="run-header">
            <div className="run-header-top">
              <div>
                <div className="run-title">
                  <i className="fa-solid fa-layer-group" aria-hidden="true" />
                  {run.title}
                </div>
              </div>
              <span className="progress-text">
                {run.done} / {run.total} erledigt
              </span>
            </div>
            <div className="mini-bar-track">
              <div className="mini-bar-fill" style={{ width: `${(run.done / run.total) * 100}%` }} />
            </div>
          </div>
          <div className="run-body">
            <div className="call-name">{run.status}</div>
            {index === 0 ? (
              <a className="call-btn-action" href="#">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>{run.phone}</span>
              </a>
            ) : null}
          </div>
        </article>
      ))}

      <EmptyState
        icon="fa-solid fa-headset"
        text="Die Live-Ansicht ist vorbereitet. Im nächsten Schritt ziehen wir die bestehende Queue- und Planungslogik in React-State und Server-Aktionen."
      />
    </section>
  );
}
