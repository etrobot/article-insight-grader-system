import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import standardPrompt from '@/prompts/standardPrompt';

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const useAiStandardGeneration = (apiConfig: ApiConfig) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateStandard = async (systemName: string, systemDescription: string) => {
    if (!apiConfig.baseUrl || !apiConfig.apiKey) {
      toast({
        title: "API未配置",
        description: "请先在API设置中配置您的API信息",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const prompt = standardPrompt
        .replace('{{systemName}}', systemName)
        .replace('{{systemDescription}}', systemDescription);

      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的内容质量评估专家，擅长设计科学、全面的评估标准体系。请返回结构化的JSON数据。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('AI返回内容为空');
      }

      let parsedStandard;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedStandard = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('未找到有效的JSON格式');
        }
      } catch (parseError) {
        console.error('解析AI返回内容失败:', content, parseError);
        throw new Error('AI返回内容无法解析为JSON，请检查提示词或稍后重试');
      }

      toast({
        title: "生成成功",
        description: "AI已为您生成评估标准，正在跳转到详情页面",
      });

      // 直接返回解析后的标准对象
      return parsedStandard;

    } catch (error) {
      console.error('生成标准失败:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "生成过程中出现错误",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateStandard, isGenerating };
};
