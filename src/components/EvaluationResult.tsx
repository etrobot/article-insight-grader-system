
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  FileText,
  BarChart3,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface EvaluationResultProps {
  result: any;
  onBack: () => void;
}

export const EvaluationResult = ({ result, onBack }: EvaluationResultProps) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
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
                {result.standard?.name}
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

      {/* 分类评估详情 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>详细评分</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.categories?.map((category: any) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">{category.name}</h3>
                    <p className="text-muted-foreground text-sm">{category.comment}</p>
                  </div>
                  <Badge 
                    variant={getScoreBadgeVariant(category.score, category.max_score)}
                    className="text-lg px-3 py-1"
                  >
                    {category.score}/{category.max_score}
                  </Badge>
                </div>

                {/* 标准详情 */}
                {category.criteria?.map((criterion: any) => (
                  <div key={criterion.id} className="ml-4 p-3 bg-background rounded border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-foreground font-medium">{criterion.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${getScoreColor(criterion.score, criterion.max_score)} border-current`}
                      >
                        {criterion.score}/{criterion.max_score}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{criterion.comment}</p>
                  </div>
                ))}
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

      {/* 改进建议 */}
      {result.suggestions && result.suggestions.length > 0 && (
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>改进建议</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg border border-border">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
