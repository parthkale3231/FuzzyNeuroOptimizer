import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";

interface FuzzyRuleCardProps {
  condition: string;
  action: string;
  isActive: boolean;
  confidence: number;
}

export function FuzzyRuleCard({ condition, action, isActive, confidence }: FuzzyRuleCardProps) {
  return (
    <Card
      className={`transition-all ${isActive ? "border-primary bg-primary/5" : ""}`}
      data-testid={`card-fuzzy-rule-${isActive ? "active" : "inactive"}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
            {isActive && <Zap className="h-3 w-3" />}
            {isActive ? "Active" : "Standby"}
          </Badge>
          {isActive && (
            <span className="text-xs font-mono text-muted-foreground">
              {confidence}% confidence
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">IF</p>
            <p className="text-xs text-muted-foreground mt-1">{condition}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">THEN</p>
            <p className="text-xs text-muted-foreground mt-1">{action}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
