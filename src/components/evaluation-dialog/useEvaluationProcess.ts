import { evaluateSingleStandard } from './evaluationApi';
import { EvaluationSystem } from '@/hooks/useStandards';
import { EvaluationQueueItemData } from './types';

interface EvaluationProcessParams {
  selectedStandards: EvaluationSystem[];
  articleContent: string;
  apiConfig: any;
  onProgress: (progress: number, description: string) => void;
  onResult: (result: any) => void;
  updateQueueItem: (id: string, updates: Partial<EvaluationQueueItemData>) => void;
  queueItems: EvaluationQueueItemData[];
  groupKey?: string;
}

export const evaluationProcess = async ({
  selectedStandards,
  articleContent,
  apiConfig,
  onProgress,
  onResult,
  updateQueueItem,
  queueItems,
  groupKey
}: EvaluationProcessParams) => {
  for (let i = 0; i < selectedStandards.length; i++) {
    const standard = selectedStandards[i];
    const queueItem = queueItems[i];
    if (!queueItem) {
      console.warn('未找到对应的队列项:', standard);
      continue;
    }
    try {
      updateQueueItem(queueItem.id, { status: 'evaluating', progress: (i / selectedStandards.length) * 100 });
      onProgress((i / selectedStandards.length) * 100, `开始评估标准: ${standard.name}`);
      console.log(`开始评估标准: ${standard.name}`);
      const result = await evaluateSingleStandard(standard, articleContent, apiConfig, groupKey);
      console.log(`评估完成: ${standard.name}`, result);
      updateQueueItem(queueItem.id, { status: 'completed', progress: ((i + 1) / selectedStandards.length) * 100, result });
      onResult(result);
      onProgress(((i + 1) / selectedStandards.length) * 100, `已完成标准"${standard.name}"的评估`);
    } catch (error: any) {
      console.error(`评估标准"${standard.name}"失败:`, error);
      updateQueueItem(queueItem.id, { status: 'failed', error: error?.message || '未知错误', progress: ((i + 1) / selectedStandards.length) * 100 });
      onProgress(((i + 1) / selectedStandards.length) * 100, `标准"${standard.name}"评估失败: ${error instanceof Error ? error.message : '未知错误'}`);
      break;
    }
  }
};
