
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';
import { evaluateSingleStandard } from './evaluationApi';

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
  const [currentEvaluationIndex, setCurrentEvaluationIndex] = useState(-1);
  const [completedEvaluations, setCompletedEvaluations] = useState<any[]>([]);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const { toast } = useToast();
  const isEvaluatingRef = useRef(false);

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
    setCurrentEvaluationIndex(-1);
    setEvaluationProgress(0);
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
    console.log('选中的标准数量:', selectedStandardIds.length);
    console.log('文章内容长度:', articleContent.trim().length);
    console.log('API配置:', apiConfig);

    if (!validateInputs()) {
      return;
    }

    setIsEvaluating(true);
    isEvaluatingRef.current = true;
    setCurrentEvaluationIndex(0);
    setCompletedEvaluations([]);
    setEvaluationProgress(0);

    const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));
    const results: any[] = [];

    try {
      for (let i = 0; i < selectedStandards.length; i++) {
        // 使用 ref 来检查是否应该停止评估
        if (!isEvaluatingRef.current) {
          console.log('评估被用户停止');
          break;
        }

        setCurrentEvaluationIndex(i);
        setEvaluationProgress((i / selectedStandards.length) * 100);

        const standard = selectedStandards[i];
        console.log(`开始评估标准: ${standard.name}`);

        try {
          const result = await evaluateSingleStandard(standard, articleContent, apiConfig);
          results.push(result);
          setCompletedEvaluations([...results]);
          
          toast({
            title: "评估完成",
            description: `已完成标准"${standard.name}"的评估`,
          });
        } catch (error) {
          console.error(`评估标准"${standard.name}"失败:`, error);
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
        results.forEach(result => {
          onEvaluationComplete(result);
        });

        setEvaluationProgress(100);
        
        toast({
          title: "所有评估完成",
          description: `成功完成 ${results.length} 个标准的评估`,
        });

        setTimeout(() => {
          onClose();
          resetState();
        }, 1500);
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
    setCurrentEvaluationIndex(-1);
    setCompletedEvaluations([]);
    setEvaluationProgress(0);
    isEvaluatingRef.current = false;
  };

  const handleCancel = () => {
    if (isEvaluating) {
      stopEvaluation();
    }
    onClose();
    resetState();
  };

  return {
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
    stopEvaluation,
    resetState
  };
};
