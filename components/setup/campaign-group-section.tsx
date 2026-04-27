import { CampaignGroupCard } from "@/components/setup/campaign-group-card";
import { SectionTitle } from "@/components/ui/section-title";
import { SetupLeadGroup } from "@/types/setup";

type CampaignGroupSectionProps = {
  title: string;
  icon: string;
  groups: SetupLeadGroup[];
  className?: string;
  onPreviewOpen: (group: SetupLeadGroup) => void;
  onPlanOpen: (group: SetupLeadGroup) => void;
  onStart: (group: SetupLeadGroup) => void;
};

export function CampaignGroupSection({
  title,
  icon,
  groups,
  className,
  onPreviewOpen,
  onPlanOpen,
  onStart,
}: CampaignGroupSectionProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle icon={icon} title={title} className={className} />
      {groups.map((group) => (
        <CampaignGroupCard
          group={group}
          key={group.id}
          onPreviewOpen={onPreviewOpen}
          onPlanOpen={onPlanOpen}
          onStart={onStart}
        />
      ))}
    </>
  );
}
