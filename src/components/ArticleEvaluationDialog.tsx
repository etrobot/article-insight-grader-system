import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';

import { EvaluationQueue } from './evaluation-dialog/EvaluationQueue';
import { StandardSelector, StandardSelectorRef } from './evaluation-dialog/StandardSelector';
import { ArticleContentInput } from './evaluation-dialog/ArticleContentInput';
import { useEvaluationLogic } from './evaluation-dialog/useEvaluationLogic';
import { EvaluationResult as EvaluationResultType } from './evaluation-dialog/types';
import { useRef } from 'react';
import { useStandards, EvaluationSystem } from '@/hooks/useStandards';

interface ArticleEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standards: EvaluationSystem[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: EvaluationResultType | EvaluationResultType[]) => void;
}

export const ArticleEvaluationDialog = ({
  open,
  onOpenChange,
  standards,
  apiConfig,
  onEvaluationComplete
}: ArticleEvaluationDialogProps) => {
  const {
    selectedStandardIds,
    articleContent,
    isEvaluating,
    queueItems,
    overallProgress,
    completedCount,
    setArticleContent,
    handleStandardToggle,
    handleEvaluate,
    handleCancel,
    stopEvaluation,
    evaluationResults
  } = useEvaluationLogic({
    standards,
    apiConfig,
    onEvaluationComplete,
    onClose: () => onOpenChange(false)
  });

  const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));

  // 新增：用于获取和保存权重
  const standardSelectorRef = useRef<StandardSelectorRef>(null);
  const { updateStandard } = useStandards();

  // 包装 handleEvaluate，先保存权重
  const handleEvaluateWithWeight = () => {
    let weightedStandards = selectedStandards;
    if (standardSelectorRef.current) {
      const weights = standardSelectorRef.current.getWeights();
      weightedStandards = selectedStandards.map(std => ({
        ...std,
        weight_in_parent: weights[std.id] ?? 0
      }));
      console.log('handleEvaluateWithWeight: 权重map:', weights);
      console.log('handleEvaluateWithWeight: 带权重的标准:', weightedStandards);
      // 存储到localStorage
      const ids = selectedStandards.map(std => std.id);
      const key = 'std_w8s_' + ids.slice().sort().join('_');
      localStorage.setItem(key, JSON.stringify(weights));
      console.log('[ArticleEvaluationDialog] 评估时存储权重到localStorage', key, weights);
    }
    const groupKey = Date.now().toString();
    handleEvaluate(weightedStandards, groupKey);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>内容评估</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 评估队列 - 在评估开始后显示 */}
          <EvaluationQueue
            queueItems={queueItems}
            overallProgress={overallProgress}
            isEvaluating={isEvaluating}
            onStop={stopEvaluation}
            totalStandards={selectedStandards.length}
            completedCount={completedCount}
          />

          {/* 标准选择器 - 仅在未开始评估时显示 */}
          {!isEvaluating && queueItems.length === 0 && (
            <StandardSelector
              ref={standardSelectorRef}
              standards={standards}
              selectedStandardIds={selectedStandardIds}
              onStandardToggle={handleStandardToggle}
              isEvaluating={isEvaluating}
            />
          )}

          {/* 内容内容输入 - 仅在未开始评估时显示 */}
          {!isEvaluating && queueItems.length === 0 && (
            <ArticleContentInput
              articleContent={articleContent}
              onContentChange={setArticleContent}
              isEvaluating={isEvaluating}
            />
          )}

          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={false}
              className="text-foreground hover:text-foreground"
            >
              {isEvaluating ? '停止并关闭' : '取消'}
            </Button>
            {(!isEvaluating && queueItems.length === 0) && (
              <Button
                onClick={handleEvaluateWithWeight}
                disabled={selectedStandardIds.length === 0 || !articleContent.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                开始评估
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
