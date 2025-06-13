import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { List, X, BarChart3 } from 'lucide-react';
import { EvaluationQueueItem, EvaluationQueueItemData } from './EvaluationQueueItem';

interface EvaluationQueueProps {
  queueItems: EvaluationQueueItemData[];
  overallProgress: number;
  isEvaluating: boolean;
  onStop: () => void;
  totalStandards: number;
  completedCount: number;
}

export const EvaluationQueue = ({
  queueItems,
  overallProgress,
  isEvaluating,
  onStop,
  totalStandards,
  completedCount
}: EvaluationQueueProps) => {
  if (queueItems.length === 0) return null;

  const failedCount = queueItems.filter(item => item.status === 'failed').length;
  const successCount = queueItems.filter(item => item.status === 'completed').length;

  return (
    <Card className="border-border bg-gradient-to-r from-muted to-muted/50 dark:from-muted dark:to-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground flex items-center space-x-2">
          <List className="w-5 h-5" />
          <span>评估队列</span>
          <div className="ml-auto flex items-center space-x-2">
            {isEvaluating && (
              <Button
                onClick={onStop}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-2" />
                停止评估
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 总体进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">总体进度</span>
            <span className="text-foreground font-medium">
              {completedCount} / {totalStandards} 已完成
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-lg font-semibold text-green-600">{successCount}</div>
            <div className="text-xs text-muted-foreground">已完成</div>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-lg font-semibold text-destructive">{failedCount}</div>
            <div className="text-xs text-muted-foreground">失败</div>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-lg font-semibold text-primary">
              {queueItems.filter(item => item.status === 'queued' || item.status === 'evaluating').length}
            </div>
            <div className="text-xs text-muted-foreground">进行中</div>
          </div>
        </div>

        {/* 队列列表 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>评估详情</span>
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {queueItems.map((item, index) => {
                console.log(`渲染队列项 ${index}:`, item);
                return (
                  <EvaluationQueueItem
                    key={`${item.id}-${item.status}`}
                    item={item}
                    index={index}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
