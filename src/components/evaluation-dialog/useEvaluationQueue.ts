
import { Standard } from '@/hooks/useStandards';
import { EvaluationQueueItemData, EvaluationStatus } from './EvaluationQueueItem';

export const useEvaluationQueue = (
  setQueueItems: React.Dispatch<React.SetStateAction<EvaluationQueueItemData[]>>
) => {
  const createQueueItems = (selectedStandards: Standard[]): EvaluationQueueItemData[] => {
    return selectedStandards.map(standard => ({
      id: `${standard.id}-${Date.now()}`,
      standard,
      status: 'queued' as EvaluationStatus
    }));
  };

  const updateQueueItem = (id: string, updates: Partial<EvaluationQueueItemData>) => {
    setQueueItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return {
    createQueueItems,
    updateQueueItem
  };
};
