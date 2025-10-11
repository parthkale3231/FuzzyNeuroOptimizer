import { FuzzyRuleCard } from '../FuzzyRuleCard';

export default function FuzzyRuleCardExample() {
  return (
    <div className="space-y-4 p-4">
      <FuzzyRuleCard
        condition="Temperature HIGH AND Energy Usage HIGH"
        action="Reduce building A/C output by 15%"
        isActive={true}
        confidence={87}
      />
      <FuzzyRuleCard
        condition="Pollution HIGH AND Traffic HIGH AND Wind LOW"
        action="Activate air purifiers AND reroute traffic"
        isActive={false}
        confidence={0}
      />
    </div>
  );
}
