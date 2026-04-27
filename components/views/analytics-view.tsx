import { SectionTitle } from "@/components/ui/section-title";

export function AnalyticsView() {
  return (
    <section className="view active">
      <article className="card big-kpi">
        <div className="big-number">18%</div>
        <div className="big-label">Termin-Quote</div>
      </article>

      <div className="analytics-grid">
        <article className="analytics-tile">
          <b>126</b>
          <span>Leads total</span>
        </article>
        <article className="analytics-tile">
          <b>92</b>
          <span>Erledigt</span>
        </article>
        <article className="analytics-tile">
          <b>34</b>
          <span>Offen</span>
        </article>
      </div>

      <article className="card">
        <SectionTitle icon="fa-solid fa-chart-bar" title="Verteilung" />
        <div className="bar-row">
          <div className="bar-head">
            <span>Termin</span>
            <span>23 (18%)</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill success" style={{ width: "18%" }} />
          </div>
        </div>
        <div className="bar-row">
          <div className="bar-head">
            <span>Interesse</span>
            <span>17 (13%)</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill info" style={{ width: "13%" }} />
          </div>
        </div>
        <div className="bar-row">
          <div className="bar-head">
            <span>Kein Interesse</span>
            <span>41 (33%)</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill danger" style={{ width: "33%" }} />
          </div>
        </div>
      </article>

      <article className="card">
        <SectionTitle icon="fa-solid fa-download" title="Listen-Verwaltung & Export" />
        <div className="export-row">
          <div>
            <strong>Handwerk</strong>
            <p>32 Leads, 6 Termine</p>
          </div>
          <button className="icon-btn" type="button">
            <i className="fa-solid fa-download" aria-hidden="true" />
          </button>
        </div>
        <div className="export-row">
          <div>
            <strong>IT</strong>
            <p>28 Leads, 4 Termine</p>
          </div>
          <button className="icon-btn" type="button">
            <i className="fa-solid fa-download" aria-hidden="true" />
          </button>
        </div>
        <button className="btn btn-primary wide-btn" type="button">
          <i className="fa-solid fa-file-csv" aria-hidden="true" />
          Vollständiges CRM Backup (.csv)
        </button>
      </article>
    </section>
  );
}
