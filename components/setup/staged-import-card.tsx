type StagedImportCardProps = {
  stagedCount: number;
  isPreviewOpen: boolean;
  onPreviewToggle: () => void;
  onAcceptImport: () => void;
};

export function StagedImportCard({
  stagedCount,
  isPreviewOpen,
  onPreviewToggle,
  onAcceptImport,
}: StagedImportCardProps) {
  if (stagedCount === 0) {
    return null;
  }

  return (
    <div className="setup-import-card">
      <div className="import-review-row">
        <div>
          <p className="tiny-label">Import bereit</p>
          <div className="import-count">{stagedCount} Leads</div>
        </div>
        <button className="btn btn-outline review-btn" type="button" onClick={onPreviewToggle}>
          <i className={`fa-solid ${isPreviewOpen ? "fa-eye-slash" : "fa-list"}`} aria-hidden="true" />
          {isPreviewOpen ? "Liste schliessen" : "Liste prüfen"}
        </button>
      </div>
      <button className="btn btn-primary wide-btn" type="button" onClick={onAcceptImport}>
        <i className="fa-solid fa-check-double" aria-hidden="true" />
        Daten ins System übernehmen
      </button>
    </div>
  );
}
