
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, BarChart3, Trash2, Eye } from 'lucide-react';
import { ArticleEvaluation } from '@/hooks/useArticleEvaluations';

interface EvaluationsListProps {
  evaluations: ArticleEvaluation[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EvaluationsList = ({ evaluations, onView, onDelete }: EvaluationsListProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
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

  if (evaluations.length === 0) {
    return (
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-secondary rounded-full">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-foreground text-lg font-medium">暂无评估记录</h3>
            <p className="text-muted-foreground text-sm mt-2">
              使用"评估内容"功能来创建您的第一个评估记录
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold mb-2">内容评估记录</h2>
        <p className="text-muted-foreground">查看和管理您的内容评估历史</p>
      </div>

      <div className="grid gap-6">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="bg-card backdrop-blur-sm border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground text-lg mb-2">
                    {evaluation.article_title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    评估标准: {evaluation.standard_name}
                  </CardDescription>
                </div>
                <Badge 
                  variant={getScoreBadgeVariant(evaluation.total_score)}
                  className="text-lg px-3 py-1"
                >
                  {evaluation.total_score}分
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(evaluation.evaluation_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className={getScoreColor(evaluation.total_score)}>
                      {evaluation.total_score >= 80 ? '优秀' : evaluation.total_score >= 60 ? '良好' : '需改进'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(evaluation.id)}
                    variant="outline"
                    size="sm"
                    className="border-border text-white hover:bg-secondary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  <Button
                    onClick={() => onDelete(evaluation.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
