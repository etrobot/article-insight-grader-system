
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';
import { FileText, Sparkles, Calendar, X, CheckCircle2 } from 'lucide-react';

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
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>([]);
  const [articleContent, setArticleContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluationIndex, setCurrentEvaluationIndex] = useState(-1);
  const [completedEvaluations, setCompletedEvaluations] = useState<any[]>([]);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
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
        if (!isEvaluating) break; // 检查是否被中断

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
          
          // 询问是否继续
          const shouldContinue = confirm(`标准"${standard.name}"评估失败，是否继续评估其他标准？`);
          if (!shouldContinue) {
            break;
          }
        }
      }

      if (results.length > 0) {
        // 保存所有评估结果
        results.forEach(result => {
          onEvaluationComplete(result);
        });

        setEvaluationProgress(100);
        
        toast({
          title: "所有评估完成",
          description: `成功完成 ${results.length} 个标准的评估`,
        });

        // 清理状态并关闭对话框
        setTimeout(() => {
          onOpenChange(false);
          setSelectedStandardIds([]);
          setArticleContent('');
          setCurrentEvaluationIndex(-1);
          setCompletedEvaluations([]);
          setEvaluationProgress(0);
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

  const handleCancel = () => {
    if (isEvaluating) {
      stopEvaluation();
    }
    onOpenChange(false);
    setSelectedStandardIds([]);
    setArticleContent('');
    setCurrentEvaluationIndex(-1);
    setCompletedEvaluations([]);
    setEvaluationProgress(0);
  };

  const selectedStandards = standards.filter(s => selectedStandardIds.includes(s.id));

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
          {/* 评估进度 */}
          {isEvaluating && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800">评估进度</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={evaluationProgress} className="w-full" />
                <div className="text-sm text-blue-700">
                  {currentEvaluationIndex >= 0 && currentEvaluationIndex < selectedStandards.length ? (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>正在评估: {selectedStandards[currentEvaluationIndex]?.name}</span>
                    </div>
                  ) : (
                    <span>准备开始评估...</span>
                  )}
                </div>
                <div className="text-xs text-blue-600">
                  已完成: {completedEvaluations.length} / {selectedStandards.length} 个标准
                </div>
                <Button
                  onClick={stopEvaluation}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  停止评估
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 选择评估标准 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">选择评估标准（可多选）</Label>
            {standards.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {standards.map((standard) => (
                  <div key={standard.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={standard.id}
                      checked={selectedStandardIds.includes(standard.id)}
                      onCheckedChange={() => handleStandardToggle(standard.id)}
                      disabled={isEvaluating}
                      className="mt-1"
                    />
                    <Label htmlFor={standard.id} className="flex-1 cursor-pointer">
                      <Card className={`border transition-colors ${
                        selectedStandardIds.includes(standard.id) 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-border hover:bg-secondary/50'
                      }`}>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm flex items-center space-x-2">
                            {selectedStandardIds.includes(standard.id) && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            )}
                            <span>{standard.name}</span>
                          </CardTitle>
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
              disabled={isEvaluating}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={false}
            >
              {isEvaluating ? '停止并关闭' : '取消'}
            </Button>
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating || selectedStandardIds.length === 0 || !articleContent.trim()}
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
