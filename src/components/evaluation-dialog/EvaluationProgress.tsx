
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { Standard } from '@/hooks/useStandards';

interface EvaluationProgressProps {
  isEvaluating: boolean;
  evaluationProgress: number;
  currentEvaluationIndex: number;
  selectedStandards: Standard[];
  completedEvaluations: any[];
  onStop: () => void;
}

export const EvaluationProgress = ({
  isEvaluating,
  evaluationProgress,
  currentEvaluationIndex,
  selectedStandards,
  completedEvaluations,
  onStop
}: EvaluationProgressProps) => {
  if (!isEvaluating) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800">评估进度</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={evaluationProgress} className="w-full" />
        <div className="text-sm text-blue-700">
          {currentEvaluationIndex >= 0 && currentEvaluationIndex < selectedStandards.length ? (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>正在评估: {selectedStandards[currentEvaluationIndex]?.name}</span>
            </div>
          ) : (
            <span>准备开始评估...</span>
          )}
        </div>
        <div className="text-xs text-blue-600">
          已完成: {completedEvaluations.length} / {selectedStandards.length} 个标准
        </div>
        <Button
          onClick={onStop}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          停止评估
        </Button>
      </CardContent>
    </Card>
  );
};
