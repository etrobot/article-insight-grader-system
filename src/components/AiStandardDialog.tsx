import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import standardPrompt from '@/prompts/standardPrompt';

interface AiStandardDialogProps {
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onStandardGenerated: (standardData: any) => void;
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
      const prompt = standardPrompt
        .replace('{{systemName}}', systemName)
        .replace('{{systemDescription}}', systemDescription);

      const response = await fetch(`${apiConfig.baseUrl}/v1/chat/completions`, {
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
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      console.log(content);

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
        throw new Error('AI返回内容无法解析为JSON，请检查提示词或稍后重试');
      }

      // Create the standard object for localStorage
      const standardForStorage = {
        name: systemName,
        description: systemDescription,
        evaluation_system: parsedStandard
      };

      onStandardGenerated(standardForStorage);
      setIsOpen(false);
      setSystemName('');
      setSystemDescription('');

      toast({
        title: "生成成功",
        description: "AI已为您生成评估标准，正在跳转到详情页面",
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
