
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  BarChart3, 
  Eye, 
  Trash2,
  TrendingUp 
} from 'lucide-react';
import { ArticleEvaluationGroup, ArticleEvaluation } from '@/hooks/useArticleEvaluations';

interface ArticleEvaluationsDetailProps {
  articleGroup: ArticleEvaluationGroup;
  onBack: () => void;
  onViewEvaluation: (evaluationId: string) => void;
  onDeleteEvaluation: (evaluationId: string) => void;
}

export const ArticleEvaluationsDetail = ({ 
  articleGroup, 
  onBack, 
  onViewEvaluation,
  onDeleteEvaluation 
}: ArticleEvaluationsDetailProps) => {
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

  // 按评估日期排序
  const sortedEvaluations = [...articleGroup.evaluations].sort((a, b) => 
    new Date(b.evaluation_date).getTime() - new Date(a.evaluation_date).getTime()
  );

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
          <h1 className="text-foreground text-2xl font-bold">{articleGroup.article_title}</h1>
          <p className="text-muted-foreground">评估记录详情</p>
        </div>
      </div>

      {/* 文章概览 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>评估概览</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(articleGroup.average_score)}`}>
                {articleGroup.average_score}
              </div>
              <p className="text-muted-foreground text-sm">平均分</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {articleGroup.evaluation_count}
              </div>
              <p className="text-muted-foreground text-sm">评估次数</p>
            </div>
            <div className="text-center">
              <div className="text-lg text-foreground">
                {Math.max(...articleGroup.evaluations.map(e => e.total_score))}
              </div>
              <p className="text-muted-foreground text-sm">最高分</p>
            </div>
            <div className="text-center">
              <div className="text-lg text-foreground">
                {formatDate(articleGroup.latest_date)}
              </div>
              <p className="text-muted-foreground text-sm">最新评估</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 评估记录列表 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>评估记录</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEvaluations.map((evaluation, index) => (
              <Card key={evaluation.id} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-foreground mb-1">
                        评估 #{sortedEvaluations.length - index}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        标准: {evaluation.standard_name}
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
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(evaluation.evaluation_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className={getScoreColor(evaluation.total_score)}>
                          {evaluation.total_score >= 80 ? '优秀' : evaluation.total_score >= 60 ? '良好' : '需改进'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onViewEvaluation(evaluation.id)}
                        variant="outline"
                        size="sm"
                        className="border-border text-foreground hover:bg-secondary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        onClick={() => onDeleteEvaluation(evaluation.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
