import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Standard } from '@/hooks/useStandards';
import { useEvaluationState } from './useEvaluationState';
import { useEvaluationQueue } from './useEvaluationQueue';
import { useEvaluationValidation } from './useEvaluationValidation';
import { useEvaluationProcess } from './useEvaluationProcess';
import type { EvaluationQueueItemData, EvaluationResult } from './types';

interface UseEvaluationLogicProps {
  standards: Standard[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: EvaluationResult) => void;
  onClose: () => void;
}

export const useEvaluationLogic = ({
  standards,
  apiConfig,
  onEvaluationComplete,
  onClose
}: UseEvaluationLogicProps) => {
  const { toast } = useToast();

  const {
    selectedStandardIds,
    setSelectedStandardIds,
    articleContent,
    setArticleContent,
    isEvaluating,
    setIsEvaluating,
    queueItems,
    setQueueItems,
    overallProgress,
    setOverallProgress,
    isEvaluatingRef,
    resetState
  } = useEvaluationState();

  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);

  const { createQueueItems, updateQueueItem } = useEvaluationQueue(setQueueItems);
  const { validateInputs } = useEvaluationValidation();
  const { processEvaluations } = useEvaluationProcess({
    updateQueueItem,
    setOverallProgress,
    onEvaluationComplete: (result) => {
      console.log('评估完成，更新结果:', result);
      onEvaluationComplete(result);
      setEvaluationResults(prev => {
        console.log('更新前的评估结果:', prev);
        // 检查是否已存在相同id的结果
        const existingIndex = prev.findIndex(r => r.id === result.id);
        if (existingIndex !== -1) {
          // 如果存在，则更新该结果
          const newResults = [...prev];
          newResults[existingIndex] = result;
          console.log('更新已存在的结果:', newResults);
          return newResults;
        } else {
          // 如果不存在，则添加新结果
          const newResults = [...prev, result];
          console.log('添加新结果:', newResults);
          return newResults;
        }
      });
    },
    isEvaluatingRef
  });

  const handleStandardToggle = (standardId: string) => {
    setSelectedStandardIds(prev =>
      prev.includes(standardId)
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const stopEvaluation = () => {
    isEvaluatingRef.current = false;
    setIsEvaluating(false);

    // 更新所有排队中和评估中的项目状态为部分完成
    setQueueItems(prev => prev.map(item =>
      item.status === 'queued' || item.status === 'evaluating'
        ? { ...item, status: 'partial' }
        : item
    ));

    toast({
      title: "评估已停止",
      description: "评估过程已被中断",
      variant: "destructive",
    });
  };

  const handleEvaluate = async () => {
    console.log('开始评估按钮被点击');

    if (!validateInputs({ selectedStandardIds, articleContent, apiConfig })) {
      return;
    }

    const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));

    // 初始化队列
    const initialQueue = createQueueItems(selectedStandards);
    setQueueItems(initialQueue);
    setIsEvaluating(true);
    isEvaluatingRef.current = true;
    setOverallProgress(0);

    try {
      const results = await processEvaluations(selectedStandards, initialQueue, articleContent, apiConfig);

      if (results.length > 0) {
        toast({
          title: "评估流程完成",
          description: `成功完成 ${results.length} 个标准的评估`,
        });

        // 批量回调，便于批量保存
        onEvaluationComplete(results);

        // 立即关闭对话框并重置状态
        onClose();
        resetState();
      }

    } catch (error) {
      console.error('评估过程中出现错误:', error);
      toast({
        title: "评估失败",
        description: error instanceof Error ? error.message : "评估过程中出现错误",
        variant: "destructive",
      });
    } finally {
      isEvaluatingRef.current = false;
      setIsEvaluating(false);
    }
  };

  const handleCancel = () => {
    if (isEvaluating) {
      stopEvaluation();
    }
    onClose();
    resetState();
  };

  const completedCount = queueItems.filter(item => item.status === 'completed').length;

  return {
    selectedStandardIds,
    articleContent,
    isEvaluating,
    queueItems,
    overallProgress,
    completedCount,
    evaluationResults,
    setArticleContent,
    handleStandardToggle,
    handleEvaluate,
    handleCancel,
    stopEvaluation,
    resetState
  };
};
