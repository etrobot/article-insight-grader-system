
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
              使用"评估文章"功能来创建您的第一个评估记录
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold mb-2">文章评估记录</h2>
        <p className="text-muted-foreground">查看和管理您的文章评估历史</p>
      </div>

      <div className="grid gap-6">
        {articleGroups.map((group) => (
          <Card key={group.id} className="bg-card backdrop-blur-sm border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground text-lg mb-2">
                    {group.article_title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    共 {group.evaluation_count} 个评估记录
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant={getScoreBadgeVariant(group.average_score)}
                    className="text-lg px-3 py-1"
                  >
                    平均 {group.average_score}分
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {group.evaluation_count} 次评估
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>最新: {formatDate(group.latest_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className={getScoreColor(group.average_score)}>
                      {group.average_score >= 80 ? '优秀' : group.average_score >= 60 ? '良好' : '需改进'}
                    </span>
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
                    查看评估
                  </Button>
                  <Button
                    onClick={() => onDelete(group.id)}
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
    </div>
  );
};
