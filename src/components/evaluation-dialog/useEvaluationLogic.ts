
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';
import { evaluateSingleStandard } from './evaluationApi';
import { EvaluationQueueItemData, EvaluationStatus } from './EvaluationQueueItem';

interface UseEvaluationLogicProps {
  standards: Standard[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: any) => void;
  onClose: () => void;
}

export const useEvaluationLogic = ({
  standards,
  apiConfig,
  onEvaluationComplete,
  onClose
}: UseEvaluationLogicProps) => {
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>([]);
  const [articleContent, setArticleContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [queueItems, setQueueItems] = useState<EvaluationQueueItemData[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();
  const isEvaluatingRef = useRef(false);

  const handleStandardToggle = (standardId: string) => {
    setSelectedStandardIds(prev => 
      prev.includes(standardId) 
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

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

  const stopEvaluation = () => {
    isEvaluatingRef.current = false;
    setIsEvaluating(false);
    
    // 更新所有排队中和评估中的项目状态为部分完成
    setQueueItems(prev => prev.map(item => 
      item.status === 'queued' || item.status === 'evaluating' 
        ? { ...item, status: 'partial' as EvaluationStatus }
        : item
    ));
    
    toast({
      title: "评估已停止",
      description: "评估过程已被中断",
      variant: "destructive",
    });
  };

  const validateInputs = () => {
    if (selectedStandardIds.length === 0) {
      toast({
        title: "请选择评估标准",
        description: "请至少选择一个评估标准",
        variant: "destructive",
      });
      return false;
    }

    if (!articleContent.trim()) {
      toast({
        title: "请输入文章内容",
        description: "请输入要评估的文章内容",
        variant: "destructive",
      });
      return false;
    }

    if (!apiConfig.baseUrl || !apiConfig.apiKey || !apiConfig.model) {
      toast({
        title: "请配置API设置",
        description: "请先在API设置中配置完整的API信息",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleEvaluate = async () => {
    console.log('开始评估按钮被点击');
    
    if (!validateInputs()) {
      return;
    }

    const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));
    
    // 初始化队列
    const initialQueue = createQueueItems(selectedStandards);
    setQueueItems(initialQueue);
    setIsEvaluating(true);
    isEvaluatingRef.current = true;
    setOverallProgress(0);

    const results: any[] = [];

    try {
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
          results.push(result);
          
          // 更新为已完成
          updateQueueItem(queueItem.id, { 
            status: 'completed',
            progress: 100,
            result
          });
          
          // 更新总体进度
          setOverallProgress(((i + 1) / selectedStandards.length) * 100);
          
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

      if (results.length > 0) {
        toast({
          title: "评估流程完成",
          description: `成功完成 ${results.length} 个标准的评估`,
        });

        setTimeout(() => {
          onClose();
          resetState();
        }, 3000);
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

  const resetState = () => {
    setSelectedStandardIds([]);
    setArticleContent('');
    setQueueItems([]);
    setOverallProgress(0);
    isEvaluatingRef.current = false;
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
    setArticleContent,
    handleStandardToggle,
    handleEvaluate,
    handleCancel,
    stopEvaluation,
    resetState
  };
};
