type SectionTitleProps = {
  icon: string;
  title: string;
  className?: string;
};

export function SectionTitle({ icon, title, className }: SectionTitleProps) {
  return (
    <div className={`step-title ${className ?? ""}`.trim()}>
      <i className={icon} aria-hidden="true" />
      <span>{title}</span>
    </div>
  );
}
