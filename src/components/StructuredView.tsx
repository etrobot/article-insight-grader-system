
import { Badge } from '@/components/ui/badge';

interface Criterion {
  name: string;
  weight: number;
  score_range?: [number, number];
  description?: string;
}

interface Category {
  name: string;
  weight: number;
  description?: string;
  criteria?: { [key: string]: Criterion };
}

interface EvaluationSystem {
  name: string;
  description?: string;
  version: string;
  total_weight: number;
  categories?: { [key: string]: Category };
}

interface StructuredViewProps {
  evaluationSystem: EvaluationSystem;
}

export const StructuredView = ({ evaluationSystem }: StructuredViewProps) => {
  return (
    <div className="space-y-6">
      {/* 系统信息 */}
      <div className="p-4 bg-secondary rounded-lg border border-border">
        <h3 className="text-foreground font-semibold text-lg mb-2">
          {evaluationSystem.name}
        </h3>
        {evaluationSystem.description && (
          <p className="text-muted-foreground text-sm mb-3">
            {evaluationSystem.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            版本 {evaluationSystem.version}
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            总权重 {evaluationSystem.total_weight}
          </Badge>
        </div>
      </div>

      {/* 评估类别 */}
      <div className="space-y-4">
        <h4 className="text-foreground font-medium">评估类别详情</h4>
        {Object.entries(evaluationSystem.categories || {}).map(([catId, category]: [string, Category]) => (
          <div key={catId} className="p-4 bg-secondary rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-foreground font-medium">{category.name}</h5>
              <Badge variant="outline" className="border-border text-muted-foreground">
                权重 {category.weight}%
              </Badge>
            </div>
            {category.description && (
              <p className="text-muted-foreground text-sm">{category.description}</p>
            )}

            {/* 评估标准 */}
            {category.criteria && Object.keys(category.criteria).length > 0 && (
              <div className="space-y-2">
                <h6 className="text-muted-foreground text-sm font-medium">评估标准:</h6>
                {Object.entries(category.criteria).map(([critId, criterion]: [string, Criterion]) => (
                  <div key={critId} className="p-3 bg-background rounded border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground text-sm font-medium">{criterion.name}</span>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                          权重 {criterion.weight}
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                          {criterion.score_range?.[0]}-{criterion.score_range?.[1]}分
                        </Badge>
                      </div>
                    </div>
                    {criterion.description && (
                      <p className="text-muted-foreground text-xs">{criterion.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
