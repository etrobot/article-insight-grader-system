import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Copy,
  CheckCircle
} from 'lucide-react';
import { ArticleEvaluationGroup, ArticleEvaluation } from '@/hooks/useArticleEvaluations';
import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
  const cardRef = useRef<HTMLDivElement>(null); // 创建一个ref来引用Card组件

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

  // 计算加权总分
  const weightedTotalScore = articleGroup.evaluations.reduce((sum, evaluation) => {
    const weight = evaluation.weight_in_parent !== undefined ? evaluation.weight_in_parent : (1 / articleGroup.evaluations.length);
    return sum + (evaluation.total_score * weight);
  }, 0);

  // 找到最高分评估的标准名称
  const highestScoreEvaluation = articleGroup.evaluations.reduce((prev, current) => {
    return (prev.total_score > current.total_score) ? prev : current;
  });

  // criterion分数颜色
  const getScoreColorForCriterion = (score: number) => {
    switch (score) {
      case 5:
        return 'text-teal-600 font-bold';
      case 4:
        return 'text-green-400 font-semibold';
      case 3:
        return 'text-yellow-500 font-semibold';
      case 2:
        return 'text-amber-500 font-semibold';
      case 1:
        return 'text-orange-500 font-semibold';
      case 0:
        return 'text-red-400 font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };

  const copyToClipboard = () => {
    if (cardRef.current) {
      let textToCopy = cardRef.current.innerText;
      textToCopy = textToCopy.replace(/\n\//g, '/'); // 将\n/替换为顿号
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          toast({
            className: "py-10",
            description: <div className="flex items-center text-lg"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /><strong>内容已复制到剪贴板！</strong></div>,
          });
        })
        .catch(err => {
          console.error('复制失败:', err);
          toast({
            title: "复制失败",
            description: "复制失败，请检查浏览器权限。",
            variant: "destructive",
          });
        });
    }
  };

  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-secondary"
        >
          <Copy className="w-4 h-4 mr-2" />
          复制为文本
        </Button>
      </div>

      {/* 评估记录列表 */}
      <Card ref={cardRef} className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
        <CardTitle className='md:flex text-md md:justify-between'>
          {articleGroup.article_title} <div className="text-muted-foreground">{formatDate(articleGroup.latest_date)}</div>
        </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex justify-between mb-4 items-end">
        <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {articleGroup.evaluation_count}
              </div>
              <p className="text-muted-foreground text-sm">评估数</p>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${getScoreColor(articleGroup.average_score)}`}>
                {weightedTotalScore.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-sm">加权总分</p>
            </div>

            <div className="text-center">
              <div className="text-lg text-foreground">
              {highestScoreEvaluation.standard_name}{Math.max(...articleGroup.evaluations.map(e => e.total_score))}分
              </div>
              <p className="text-muted-foreground text-sm">最高分</p>
            </div>
          </div>
          <div className="space-y-4">
            {sortedEvaluations.map((evaluation, index) => (
              <Card key={evaluation.id} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-foreground mb-1">
                        {evaluation.standard_name}
                      </CardTitle>
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
                  <div className="mt-4 space-y-1">
                    {evaluation.criteria && evaluation.criteria.map((criterion) => (
                      <div key={criterion.id} className="flex flex-col gap-1 border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex items-center text-sm">
                          <div className={getScoreColorForCriterion(criterion.score)}>{criterion.score}</div>
                          <div className="text-muted-foreground">/{criterion.max_score}</div>
                          <div className="font-medium text-foreground ml-1"> {criterion.name}:</div>
                        </div>
                        {criterion.comment && (
                          <div className="text-xs text-muted-foreground pl-2 pt-1">{criterion.comment}</div>
                        )}
                      </div>
                    ))}
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
