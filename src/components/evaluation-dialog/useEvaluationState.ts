
import { useState, useRef } from 'react';
import { EvaluationQueueItemData } from './EvaluationQueueItem';

export const useEvaluationState = () => {
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>([]);
  const [articleContent, setArticleContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [queueItems, setQueueItems] = useState<EvaluationQueueItemData[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const isEvaluatingRef = useRef(false);

  const resetState = () => {
    setSelectedStandardIds([]);
    setArticleContent('');
    setQueueItems([]);
    setOverallProgress(0);
    isEvaluatingRef.current = false;
  };

  return {
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
  };
};
