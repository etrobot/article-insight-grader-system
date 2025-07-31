import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, BarChart3, Trash2, Eye, TrendingUp } from 'lucide-react';
import { ArticleEvaluationGroup } from '@/hooks/useArticleEvaluations';

interface ArticleGroupsListProps {
  articleGroups: ArticleEvaluationGroup[];
  onView: (articleId: string) => void;
  onDelete: (articleId: string) => void;
}

export const ArticleGroupsList = ({ articleGroups, onView, onDelete }: ArticleGroupsListProps) => {
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

  if (articleGroups.length === 0) {
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
      <div className="grid gap-6">
        {articleGroups.map((group) => {
          // 计算加权总分
          let weightedTotalScore = 0;
          if (group.evaluations && group.evaluations.length > 0) {
            weightedTotalScore = group.evaluations.reduce((sum, evaluation) => {
              const weight = evaluation.weight_in_parent !== undefined ? evaluation.weight_in_parent : (1 / group.evaluations.length);
              return sum + (evaluation.total_score * weight);
            }, 0);
          }
          console.log('group:', group.article_title, 'weightedTotalScore:', weightedTotalScore);
          return (
            <Card key={group.id} className="bg-card backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground text-lg mb-2">
                      {group.article_title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />{formatDate(group.latest_date)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={getScoreBadgeVariant(weightedTotalScore)}
                      className="text-lg px-3 py-1"
                    >
                      {weightedTotalScore.toFixed(0)}分
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>共 {group.evaluation_count} 个评估</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* <TrendingUp className="w-4 h-4" />
                      <span className={getScoreColor(weightedTotalScore)}>
                       {weightedTotalScore >= 80 ? '优秀' : weightedTotalScore >= 60 ? '良好' : '需改进'} 

                      </span>*/}
                       user1
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onView(group.id)}
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      详情
                    </Button>
                    <Button
                      onClick={() => onDelete(group.id)}
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
          );
        })}
      </div>
    </div>
  );
};
