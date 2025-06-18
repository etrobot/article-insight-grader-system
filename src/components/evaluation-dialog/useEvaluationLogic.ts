import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { EvaluationSystem } from '@/hooks/useStandards';
import { useEvaluationState } from './useEvaluationState';
import { useEvaluationQueue } from './useEvaluationQueue';
import { useEvaluationValidation } from './useEvaluationValidation';
import { evaluationProcess } from './useEvaluationProcess';
import type { EvaluationResult } from './types';

interface UseEvaluationLogicProps {
  standards: EvaluationSystem[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: EvaluationResult, groupKey?: string) => void;
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

  // 组装 process 需要的回调，放到 useEvaluationLogic 顶层
  const onProgress = (progress: number, description: string) => {
    console.log('评估进度:', progress, description);
    setOverallProgress(progress);
  };
  const onResult = (result: EvaluationResult, groupKey?: string) => {
    console.log('评估完成，更新结果:', result, 'groupKey:', groupKey);
    onEvaluationComplete(result, groupKey);
    setEvaluationResults(prev => {
      console.log('更新前的评估结果:', prev);
      const existingIndex = prev.findIndex(r => r.id === result.id);
      if (existingIndex !== -1) {
        const newResults = [...prev];
        newResults[existingIndex] = result;
        console.log('更新已存在的结果:', newResults);
        return newResults;
      } else {
        const newResults = [...prev, result];
        console.log('添加新结果:', newResults);
        return newResults;
      }
    });
  };

  const handleEvaluate = async (externalSelectedStandards?: EvaluationSystem[], groupKey?: string) => {
    console.log('开始评估按钮被点击, groupKey:', groupKey);

    if (!validateInputs({ selectedStandardIds, articleContent, apiConfig })) {
      return;
    }

    // 优先用外部传入的标准数组
    const selectedStandardsToUse = externalSelectedStandards ?? standards.filter(s => selectedStandardIds.includes(s.id!));
    console.log('handleEvaluate: 使用的标准数组:', selectedStandardsToUse);

    // 初始化队列
    const initialQueue = createQueueItems(selectedStandardsToUse);
    setQueueItems(initialQueue);
    setIsEvaluating(true);
    isEvaluatingRef.current = true;
    setOverallProgress(0);

    try {
      await evaluationProcess({
        selectedStandards: selectedStandardsToUse,
        articleContent,
        apiConfig,
        onProgress,
        onResult: (result) => onResult(result, groupKey),
        updateQueueItem,
        queueItems: initialQueue,
        groupKey,
        isEvaluatingRef
      });
      toast({
        title: "评估流程完成",
        description: `成功完成 ${selectedStandardsToUse.length} 个标准的评估`,
      });
      onClose();
      resetState();
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
    standards,
    selectedStandardIds,
    setSelectedStandardIds,
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
