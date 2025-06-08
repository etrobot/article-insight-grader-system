
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';
import { FileText, Sparkles, Calendar } from 'lucide-react';

interface ArticleEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standards: Standard[];
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onEvaluationComplete: (evaluationResult: any) => void;
}

export const ArticleEvaluationDialog = ({
  open,
  onOpenChange,
  standards,
  apiConfig,
  onEvaluationComplete
}: ArticleEvaluationDialogProps) => {
  const [selectedStandardId, setSelectedStandardId] = useState<string>('');
  const [articleContent, setArticleContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEvaluate = async () => {
    if (!selectedStandardId) {
      toast({
        title: "请选择评估标准",
        description: "请先选择一个评估标准",
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

    try {
      const selectedStandard = standards.find(s => s.id === selectedStandardId);
      if (!selectedStandard) {
        throw new Error('未找到选中的评估标准');
      }

      const evaluationPrompt = `请根据以下评估标准对文章进行详细评估：

评估标准：
${JSON.stringify(selectedStandard.evaluation_system, null, 2)}

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

      // 解析JSON结果
      const jsonMatch = evaluationContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('评估结果格式不正确');
      }

      const evaluationResult = JSON.parse(jsonMatch[0]);
      
      // 添加标准信息到评估结果
      evaluationResult.standard = selectedStandard;
      evaluationResult.id = Date.now().toString();

      onEvaluationComplete(evaluationResult);
      onOpenChange(false);
      setSelectedStandardId('');
      setArticleContent('');

      toast({
        title: "评估完成",
        description: "文章评估已完成，查看详细结果",
      });

    } catch (error) {
      console.error('评估失败:', error);
      toast({
        title: "评估失败",
        description: error instanceof Error ? error.message : "评估过程中出现错误",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedStandardId('');
    setArticleContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>文章评估</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 选择评估标准 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">选择评估标准</Label>
            {standards.length > 0 ? (
              <RadioGroup value={selectedStandardId} onValueChange={setSelectedStandardId}>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {standards.map((standard) => (
                    <div key={standard.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={standard.id} id={standard.id} className="mt-1" />
                      <Label htmlFor={standard.id} className="flex-1 cursor-pointer">
                        <Card className="border border-border hover:bg-secondary/50 transition-colors">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">{standard.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {standard.description}
                            </CardDescription>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(standard.createdAt)}</span>
                            </div>
                          </CardHeader>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <p>暂无评估标准</p>
                    <p className="text-sm">请先在"标准构建"页面创建评估标准</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 文章内容输入 */}
          <div className="space-y-3">
            <Label htmlFor="article-content" className="text-base font-medium">文章内容</Label>
            <Textarea
              id="article-content"
              placeholder="请粘贴要评估的文章内容..."
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isEvaluating}
            >
              取消
            </Button>
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating || !selectedStandardId || !articleContent.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  评估中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始评估
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
