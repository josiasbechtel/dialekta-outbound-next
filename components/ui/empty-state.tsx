type EmptyStateProps = {
  icon: string;
  text: string;
};

export function EmptyState({ icon, text }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <i className={icon} aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
