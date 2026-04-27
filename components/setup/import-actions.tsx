type ImportActionsProps = {
  onManualAdd: () => void;
  onCsvImport: () => void;
};

export function ImportActions({ onManualAdd, onCsvImport }: ImportActionsProps) {
  return (
    <div className="quick-actions-grid">
      <button className="quick-action-card" type="button" onClick={onManualAdd}>
        <div className="quick-action-icon">
          <i className="fa-solid fa-user-plus" aria-hidden="true" />
        </div>
        <span>Lead manuell</span>
      </button>
      <button className="quick-action-card" type="button" onClick={onCsvImport}>
        <div className="quick-action-icon">
          <i className="fa-solid fa-file-csv" aria-hidden="true" />
        </div>
        <span>Liste laden</span>
      </button>
    </div>
  );
}
