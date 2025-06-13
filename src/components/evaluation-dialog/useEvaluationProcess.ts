import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';
import { evaluateSingleStandard } from './evaluationApi';
import { EvaluationQueueItemData } from './EvaluationQueueItem';
import { EvaluationResult } from './types';

interface UseEvaluationProcessProps {
  updateQueueItem: (id: string, updates: Partial<EvaluationQueueItemData>) => void;
  setOverallProgress: (progress: number) => void;
  onEvaluationComplete: (result: EvaluationResult) => void;
  isEvaluatingRef: React.MutableRefObject<boolean>;
}

export const useEvaluationProcess = ({
  updateQueueItem,
  setOverallProgress,
  onEvaluationComplete,
  isEvaluatingRef
}: UseEvaluationProcessProps) => {
  const { toast } = useToast();

  const processEvaluations = async (
    selectedStandards: Standard[],
    initialQueue: EvaluationQueueItemData[],
    articleContent: string,
    apiConfig: { baseUrl: string; apiKey: string; model: string }
  ) => {
    const results: EvaluationResult[] = [];

    for (let i = 0; i < selectedStandards.length; i++) {
      if (!isEvaluatingRef.current) {
        console.log('评估被用户停止');
        break;
      }

      const standard = selectedStandards[i];
      const queueItem = initialQueue[i];

      // 更新当前项目状态为评估中
      updateQueueItem(queueItem.id, {
        status: 'evaluating',
        progress: 0
      });

      console.log(`开始评估标准: ${standard.name}`);

      try {
        const result = await evaluateSingleStandard(standard, articleContent, apiConfig);
        console.log(`评估完成: ${standard.name}`, result);

        // 确保result包含id字段
        if (!result.id) {
          result.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }

        results.push(result);

        // 更新为已完成
        console.log(`更新队列项状态为已完成:`, queueItem.id);
        updateQueueItem(queueItem.id, {
          status: 'completed',
          progress: 100,
          result
        });

        // 更新总体进度
        const newProgress = ((i + 1) / selectedStandards.length) * 100;
        console.log(`更新总体进度: ${newProgress}%`);
        setOverallProgress(newProgress);

        console.log(`调用评估完成回调`);
        onEvaluationComplete(result);

        toast({
          title: "评估完成",
          description: `已完成标准"${standard.name}"的评估`,
        });
      } catch (error) {
        console.error(`评估标准"${standard.name}"失败:`, error);

        // 更新为失败状态
        updateQueueItem(queueItem.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : '未知错误'
        });

        toast({
          title: "评估失败",
          description: `标准"${standard.name}"评估失败: ${error instanceof Error ? error.message : '未知错误'}`,
          variant: "destructive",
        });

        const shouldContinue = confirm(`标准"${standard.name}"评估失败，是否继续评估其他标准？`);
        if (!shouldContinue) {
          break;
        }
      }
    }

    return results;
  };

  return { processEvaluations };
};
