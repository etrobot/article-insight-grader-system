import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { EvaluationSystem } from '@/hooks/useStandards';

interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
  standard?: EvaluationSystem;
}

interface EvaluationResult {
  article_title: string;
  total_score: number;
  evaluation_date: string;
  criteria: EvaluationCriterion[];
  summary: string;
  standard?: EvaluationSystem;
  id?: string;
  article_content?: string;
  standard_name: string;
}

interface EvaluationResultProps {
  result: EvaluationResult;
  onBack: () => void;
}

export const EvaluationResult = ({ result, onBack }: EvaluationResultProps) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">评估报告</h1>
          <p className="text-muted-foreground">{result.article_title}</p>
        </div>
      </div>

      {/* 总分概览 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>评估概览</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(result.total_score, 100)}`}>
                {result.total_score}
              </div>
              <p className="text-muted-foreground text-sm">总分</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {result.standard_name}
              </div>
              <p className="text-muted-foreground text-sm">评估标准</p>
            </div>
            <div className="text-center">
              <div className="text-lg text-foreground">
                {formatDate(result.evaluation_date)}
              </div>
              <p className="text-muted-foreground text-sm">评估时间</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细评分 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>详细评分</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.criteria?.map((criterion: EvaluationCriterion) => (
              <div key={criterion.id} className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{criterion.name}</h3>
                  <Badge
                    variant={getScoreBadgeVariant(criterion.score, criterion.max_score)}
                    className={`text-lg px-3 py-1 hover:bg-none ${
                      getScoreBadgeVariant(criterion.score, criterion.max_score) === 'default'
                        ? 'bg-green-600 text-white hover:bg-green-600'
                        : getScoreBadgeVariant(criterion.score, criterion.max_score) === 'secondary'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-600'
                        : 'bg-red-600 text-white hover:bg-red-600'
                    }`}
                  >
                    {criterion.score}/{criterion.max_score}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">{criterion.comment}</p>
                  {criterion.standard?.criteria?.find((c) => c.id === criterion.id)?.description && (
                    <div className="mt-2 p-2 bg-secondary/50 rounded text-xs text-muted-foreground">
                      <p className="font-medium mb-1">评分标准参考：</p>
                      {Object.entries(criterion.standard.criteria.find((c) => c.id === criterion.id)?.description || {}).map(([score, desc]) => (
                        <div key={score} className="flex items-start space-x-2 mb-1">
                          <span className="font-medium">{score}分：</span>
                          <span>{desc as string}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 综合评价 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>综合评价</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-foreground">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
