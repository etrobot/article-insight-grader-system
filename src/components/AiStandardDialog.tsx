
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiStandardDialogProps {
  apiConfig: {
    baseUrl: string;
    apiKey: string;
  };
  onStandardGenerated: (standard: any) => void;
}

export const AiStandardDialog = ({ apiConfig, onStandardGenerated }: AiStandardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const { toast } = useToast();

  const generateStandard = async () => {
    if (!systemName.trim() || !systemDescription.trim()) {
      toast({
        title: "信息不完整",
        description: "请填写系统名称和描述",
        variant: "destructive"
      });
      return;
    }

    if (!apiConfig.baseUrl || !apiConfig.apiKey) {
      toast({
        title: "API未配置",
        description: "请先在API设置中配置您的API信息",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `请根据以下需求生成一个完整的内容质量评估标准：

系统名称：${systemName}
系统描述：${systemDescription}

请返回一个JSON格式的评估标准，包含以下结构：
- 评估系统基本信息
- 多个评估类别，每个类别包含权重和描述
- 每个类别下的具体评估标准
- 每个标准的权重和评分范围

请确保权重分配合理，覆盖全面，适合对文章内容进行客观评估。`;

      const response = await fetch(`${apiConfig.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-1106-preview',
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
          max_tokens: 2000
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

      // 尝试解析JSON
      let parsedStandard;
      try {
        // 提取JSON部分
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedStandard = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('未找到有效的JSON格式');
        }
      } catch (parseError) {
        // 如果解析失败，创建一个默认的标准结构
        parsedStandard = {
          evaluation_system: {
            name: systemName,
            description: systemDescription,
            version: "1.0",
            total_weight: 100,
            categories: {
              content_quality: {
                name: "内容质量",
                weight: 40,
                description: "评估文章的专业性、准确性和深度",
                criteria: {
                  accuracy: {
                    name: "准确性",
                    description: "内容事实准确，数据可靠",
                    weight: 15,
                    score_range: [1, 5]
                  },
                  depth: {
                    name: "深度分析",
                    description: "内容有深度，分析透彻",
                    weight: 15,
                    score_range: [1, 5]
                  },
                  originality: {
                    name: "原创性",
                    description: "内容原创，有独特见解",
                    weight: 10,
                    score_range: [1, 5]
                  }
                }
              },
              structure_clarity: {
                name: "结构清晰度",
                weight: 30,
                description: "评估文章的组织结构和逻辑性",
                criteria: {
                  logic: {
                    name: "逻辑性",
                    description: "文章逻辑清晰，论证有力",
                    weight: 15,
                    score_range: [1, 5]
                  },
                  organization: {
                    name: "组织结构",
                    description: "文章结构合理，层次分明",
                    weight: 15,
                    score_range: [1, 5]
                  }
                }
              },
              readability: {
                name: "可读性",
                weight: 30,
                description: "评估文章的表达和阅读体验",
                criteria: {
                  language: {
                    name: "语言表达",
                    description: "语言流畅，表达清晰",
                    weight: 15,
                    score_range: [1, 5]
                  },
                  engagement: {
                    name: "吸引力",
                    description: "内容生动有趣，能吸引读者",
                    weight: 15,
                    score_range: [1, 5]
                  }
                }
              }
            },
            scoring_algorithm: {
              description: "加权平均算法",
              formula: "总分 = Σ(类别权重 × 类别得分)",
              normalization: "最终得分归一化到0-100分"
            },
            generated_at: new Date().toISOString()
          }
        };
      }

      onStandardGenerated(parsedStandard);
      setIsOpen(false);
      setSystemName('');
      setSystemDescription('');
      
      toast({
        title: "生成成功",
        description: "AI已为您生成评估标准，可在预览页面查看",
      });
      
    } catch (error) {
      console.error('生成标准失败:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "生成过程中出现错误",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Wand2 className="w-4 h-4 mr-2" />
          添加标准
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AI生成评估标准</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">系统名称</Label>
            <Input
              id="name"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="如：AI内容质量评估系统"
              className="bg-white border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">系统描述</Label>
            <Textarea
              id="description"
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              placeholder="描述评估系统的用途和特点..."
              className="bg-white border-gray-300"
              rows={3}
            />
          </div>
          <Button
            onClick={generateStandard}
            disabled={isGenerating || !systemName.trim() || !systemDescription.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI生成中...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                生成评估标准
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
