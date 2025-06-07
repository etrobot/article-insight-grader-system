
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Download, Copy, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PreviewStats } from '@/components/PreviewStats';
import { StructuredView } from '@/components/StructuredView';

interface Criterion {
  name: string;
  weight: number;
  score_range?: [number, number];
  description?: string;
}

interface Category {
  name: string;
  weight: number;
  description?: string;
  criteria?: { [key: string]: Criterion };
}

interface EvaluationSystem {
  name: string;
  description?: string;
  version: string;
  total_weight: number;
  categories?: { [key: string]: Category };
}

interface EvaluationStandard {
  evaluation_system: EvaluationSystem;
}

interface JsonPreviewProps {
  evaluationStandard: EvaluationStandard | null;
  onExport: () => void;
}

export const JsonPreview = ({ evaluationStandard, onExport }: JsonPreviewProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!evaluationStandard) return;

    const jsonString = JSON.stringify(evaluationStandard, null, 2);
    navigator.clipboard.writeText(jsonString);

    toast({
      title: "已复制",
      description: "JSON内容已复制到剪贴板",
    });
  };

  const formatJson = (obj: object) => {
    return JSON.stringify(obj, null, 2);
  };

  const getSystemStats = () => {
    if (!evaluationStandard?.evaluation_system) return null;

    const system = evaluationStandard.evaluation_system;
    const categories = Object.values(system.categories || {}) as Category[];
    const totalCriteria = categories.reduce((sum, cat) => {
      const criteria = Object.values(cat.criteria || {});
      return sum + criteria.length;
    }, 0);

    return {
      categoriesCount: categories.length,
      criteriaCount: totalCriteria,
      totalWeight: system.total_weight || 100,
      version: system.version || "1.0"
    };
  };

  const stats = getSystemStats();

  if (!evaluationStandard) {
    return (
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-secondary rounded-full">
            <FileJson className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-foreground text-lg font-medium">暂无评估标准</h3>
            <p className="text-muted-foreground text-sm mt-2">
              请先在"标准构建"页面生成评估标准
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      {stats && <PreviewStats {...stats} />}

      {/* 预览内容 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>评估标准预览</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                查看生成的评估标准详细内容
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-secondary"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
              <Button
                onClick={onExport}
                size="sm"
                className="bg-gradient-to-r from-theme-yellow to-theme-orange hover:from-yellow-600 hover:to-orange-600"
              >
                <Download className="w-4 h-4 mr-2" />
                导出JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structured" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-secondary border border-border">
              <TabsTrigger value="structured" className="data-[state=active]:bg-theme-pink data-[state=active]:text-white">
                结构化视图
              </TabsTrigger>
              <TabsTrigger value="json" className="data-[state=active]:bg-theme-pink data-[state=active]:text-white">
                JSON格式
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structured" className="space-y-4">
              <StructuredView evaluationSystem={evaluationStandard.evaluation_system} />
            </TabsContent>

            <TabsContent value="json">
              <ScrollArea className="h-96 w-full">
                <pre className="text-muted-foreground text-sm bg-secondary p-4 rounded border border-border overflow-x-auto">
                  {formatJson(evaluationStandard)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
