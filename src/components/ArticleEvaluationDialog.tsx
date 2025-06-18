import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';

import { EvaluationQueue } from './evaluation-dialog/EvaluationQueue';
import { StandardSelector, StandardSelectorRef } from './evaluation-dialog/StandardSelector';
import { ArticleContentInput } from './evaluation-dialog/ArticleContentInput';
import { useEvaluationLogic } from './evaluation-dialog/useEvaluationLogic';
import { EvaluationResult as EvaluationResultType } from './evaluation-dialog/types';
import { useRef, useState, useEffect } from 'react';
import { useStandards, EvaluationSystem } from '@/hooks/useStandards';

interface ArticleEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standards: EvaluationSystem[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
    model2?: string;
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
  // 新增：模型选择
  const [selectedModel, setSelectedModel] = useState(apiConfig.model);
  useEffect(() => {
    const saved = localStorage.getItem('article_eval_model');
    if (saved && (saved === apiConfig.model || saved === apiConfig.model2)) {
      setSelectedModel(saved);
    } else {
      setSelectedModel(apiConfig.model);
    }
  }, [apiConfig.model, apiConfig.model2]);
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    localStorage.setItem('article_eval_model', e.target.value);
    console.log('[ArticleEvaluationDialog] 选择模型:', e.target.value);
  };

  const {
    selectedStandardIds,
    setSelectedStandardIds,
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
    apiConfig: { ...apiConfig, model: selectedModel },
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
            <select value={selectedModel} onChange={handleModelChange} className="border rounded px-2 py-1 bg-background text-foreground">
              <option value={apiConfig.model}>{apiConfig.model}</option>
              {apiConfig.model2 && <option value={apiConfig.model2}>{apiConfig.model2}</option>}
            </select>
          </DialogTitle>
        </DialogHeader>


        <div className="md:flex gap-2">
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
              setSelectedStandardIds={setSelectedStandardIds}
            />
          )}

          {/* 待评内容输入 - 仅在未开始评估时显示 */}
          <div className="w-full">
          {!isEvaluating && queueItems.length === 0 && (
            <ArticleContentInput
              articleContent={articleContent}
              onContentChange={setArticleContent}
              isEvaluating={isEvaluating}
            />
            )}
          </div>
        </div>
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
      </DialogContent>
    </Dialog>
  );
};
