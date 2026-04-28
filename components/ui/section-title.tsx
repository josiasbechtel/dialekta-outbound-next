type SectionTitleProps = {
  icon: string;
  title: string;
  className?: string;
};

function getDisplayTitle(title: string) {
  if (title === "Für Vertrieb vorbereitet" || title === "Menschliche Übergabe") {
    return "Vertriebsleads";
  }

  return title;
}

export function SectionTitle({ icon, title, className }: SectionTitleProps) {
  return (
    <div className={`step-title ${className ?? ""}`.trim()}>
      <i className={icon} aria-hidden="true" />
      <span>{getDisplayTitle(title)}</span>
    </div>
  );
}
