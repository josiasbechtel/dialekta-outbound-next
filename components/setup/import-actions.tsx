type ImportActionsProps = {
  onManualAdd: () => void;
  onCsvImport: () => void;
};

export function ImportActions({ onManualAdd, onCsvImport }: ImportActionsProps) {
  return (
    <div className="quick-actions-grid">
      <button className="quick-action-card" type="button" onClick={onManualAdd}>
        <i className="fa-solid fa-user-plus" aria-hidden="true" />
        <span>Lead hinzufügen</span>
      </button>
      <button className="quick-action-card" type="button" onClick={onCsvImport}>
        <i className="fa-solid fa-file-csv" aria-hidden="true" />
        <span>CSV importieren</span>
      </button>
    </div>
  );
}
