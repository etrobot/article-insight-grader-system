
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';

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

  const handleStandardToggle = (standardId: string) => {
    setSelectedStandardIds(prev => 
      prev.includes(standardId) 
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const stopEvaluation = () => {
    setIsEvaluating(false);
    setCurrentEvaluationIndex(-1);
    setEvaluationProgress(0);
    toast({
      title: "评估已停止",
      description: "评估过程已被中断",
      variant: "destructive",
    });
  };

  const evaluateSingleStandard = async (standard: Standard, articleContent: string) => {
    const evaluationPrompt = `请根据以下评估标准对文章进行详细评估：

评估标准：
${JSON.stringify(standard.evaluation_system, null, 2)}

文章内容：
${articleContent}

请按照评估标准的结构，对文章进行逐项打分和评价，并给出总分和详细的评估报告。返回JSON格式的评估结果，包含：
- 各类别的得分和评价
- 各标准的得分和评价  
- 总分
- 综合评价
- 改进建议

请严格按照以下JSON结构返回：
{
  "article_title": "文章标题（从内容中提取或生成）",
  "total_score": 总分数字,
  "evaluation_date": "${new Date().toISOString()}",
  "categories": [
    {
      "id": "类别ID",
      "name": "类别名称", 
      "score": 得分,
      "max_score": 满分,
      "comment": "评价说明",
      "criteria": [
        {
          "id": "标准ID",
          "name": "标准名称",
          "score": 得分,
          "max_score": 满分,
          "comment": "详细评价"
        }
      ]
    }
  ],
  "summary": "综合评价总结",
  "suggestions": ["改进建议1", "改进建议2"]
}`;

    const response = await fetch(`${apiConfig.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          {
            role: 'user',
            content: evaluationPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const evaluationContent = data.choices?.[0]?.message?.content;

    if (!evaluationContent) {
      throw new Error('未收到有效的评估结果');
    }

    const jsonMatch = evaluationContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('评估结果格式不正确');
    }

    const evaluationResult = JSON.parse(jsonMatch[0]);
    evaluationResult.standard = standard;
    evaluationResult.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    evaluationResult.article_content = articleContent;

    return evaluationResult;
  };

  const handleEvaluate = async () => {
    console.log('开始评估按钮被点击');
    console.log('选中的标准数量:', selectedStandardIds.length);
    console.log('文章内容长度:', articleContent.trim().length);
    console.log('API配置:', apiConfig);

    if (selectedStandardIds.length === 0) {
      toast({
        title: "请选择评估标准",
        description: "请至少选择一个评估标准",
        variant: "destructive",
      });
      return;
    }

    if (!articleContent.trim()) {
      toast({
        title: "请输入文章内容",
        description: "请输入要评估的文章内容",
        variant: "destructive",
      });
      return;
    }

    if (!apiConfig.baseUrl || !apiConfig.apiKey || !apiConfig.model) {
      toast({
        title: "请配置API设置",
        description: "请先在API设置中配置完整的API信息",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    setCurrentEvaluationIndex(0);
    setCompletedEvaluations([]);
    setEvaluationProgress(0);

    const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));
    const results: any[] = [];

    try {
      for (let i = 0; i < selectedStandards.length; i++) {
        if (!isEvaluating) break;

        setCurrentEvaluationIndex(i);
        setEvaluationProgress((i / selectedStandards.length) * 100);

        const standard = selectedStandards[i];
        console.log(`开始评估标准: ${standard.name}`);

        try {
          const result = await evaluateSingleStandard(standard, articleContent);
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
      setIsEvaluating(false);
    }
  };

  const resetState = () => {
    setSelectedStandardIds([]);
    setArticleContent('');
    setCurrentEvaluationIndex(-1);
    setCompletedEvaluations([]);
    setEvaluationProgress(0);
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
