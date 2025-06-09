
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';
import { Standard } from '@/hooks/useStandards';
import { EvaluationProgress } from './evaluation-dialog/EvaluationProgress';
import { StandardSelector } from './evaluation-dialog/StandardSelector';
import { ArticleContentInput } from './evaluation-dialog/ArticleContentInput';
import { useEvaluationLogic } from './evaluation-dialog/useEvaluationLogic';

interface ArticleEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standards: Standard[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: any) => void;
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
    currentEvaluationIndex,
    completedEvaluations,
    evaluationProgress,
    setArticleContent,
    handleStandardToggle,
    handleEvaluate,
    handleCancel,
    stopEvaluation
  } = useEvaluationLogic({
    standards,
    apiConfig,
    onEvaluationComplete,
    onClose: () => onOpenChange(false)
  });

  const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));

  // 添加调试日志
  console.log('ArticleEvaluationDialog - 当前状态:', {
    selectedStandardIds,
    articleContentLength: articleContent.length,
    isEvaluating,
    standardsCount: standards.length
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>文章评估</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <EvaluationProgress
            isEvaluating={isEvaluating}
            evaluationProgress={evaluationProgress}
            currentEvaluationIndex={currentEvaluationIndex}
            selectedStandards={selectedStandards}
            completedEvaluations={completedEvaluations}
            onStop={stopEvaluation}
          />

          <StandardSelector
            standards={standards}
            selectedStandardIds={selectedStandardIds}
            onStandardToggle={handleStandardToggle}
            isEvaluating={isEvaluating}
          />

          <ArticleContentInput
            articleContent={articleContent}
            onContentChange={setArticleContent}
            isEvaluating={isEvaluating}
          />

          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={false}
            >
              {isEvaluating ? '停止并关闭' : '取消'}
            </Button>
            <Button
              onClick={() => {
                console.log('评估按钮被点击 - 在组件中');
                handleEvaluate();
              }}
              disabled={isEvaluating || selectedStandardIds.length === 0 || !articleContent.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  评估中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始评估
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
