
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Download,
  Copy,
  FileJson,
  BarChart3,
  Settings2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';

interface StandardDetailProps {
  standard: Standard;
  onBack: () => void;
}

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

export const StandardDetail = ({ standard, onBack }: StandardDetailProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(standard.evaluation_system, null, 2);
    navigator.clipboard.writeText(jsonString);

    toast({
      title: "已复制",
      description: "JSON内容已复制到剪贴板",
    });
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(standard.evaluation_system, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${standard.name.replace(/\s+/g, '_')}_evaluation_standard.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "导出成功",
      description: "评估标准已保存为JSON文件",
    });
  };

  const formatJson = (obj: object) => {
    return JSON.stringify(obj, null, 2);
  };

  const getSystemStats = () => {
    const system = standard.evaluation_system;
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

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">{standard.name}</h1>
          <p className="text-muted-foreground text-sm">
            创建于 {new Date(standard.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-foreground font-medium">{stats.categoriesCount}</p>
                <p className="text-muted-foreground text-sm">评估类别</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings2 className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-foreground font-medium">{stats.criteriaCount}</p>
                <p className="text-muted-foreground text-sm">评估标准</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-foreground font-medium">{stats.totalWeight}</p>
                <p className="text-muted-foreground text-sm">总权重</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-foreground font-medium">v{stats.version}</p>
                <p className="text-muted-foreground text-sm">版本号</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细内容 */}
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <FileJson className="w-5 h-5" />
                <span>评估标准详情</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {standard.description}
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
                onClick={exportJson}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
              <TabsTrigger value="structured" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                结构化视图
              </TabsTrigger>
              <TabsTrigger value="json" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                JSON格式
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structured" className="space-y-4">
              {standard.evaluation_system && (
                <div className="space-y-6">
                  {/* 系统信息 */}
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <h3 className="text-foreground font-semibold text-lg mb-2">
                      {standard.evaluation_system.name}
                    </h3>
                    {standard.evaluation_system.description && (
                      <p className="text-muted-foreground text-sm mb-3">
                        {standard.evaluation_system.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        版本 {standard.evaluation_system.version}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        总权重 {standard.evaluation_system.total_weight}
                      </Badge>
                    </div>
                  </div>

                  {/* 评估类别 */}
                  <div className="space-y-4">
                    <h4 className="text-foreground font-medium">评估类别详情</h4>
                    {Object.entries(standard.evaluation_system.categories || {}).map(([catId, category]: [string, Category]) => (
                      <div key={catId} className="p-4 bg-secondary rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-foreground font-medium">{category.name}</h5>
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            权重 {category.weight}%
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-muted-foreground text-sm">{category.description}</p>
                        )}

                        {/* 评估标准 */}
                        {category.criteria && Object.keys(category.criteria).length > 0 && (
                          <div className="space-y-2">
                            <h6 className="text-muted-foreground text-sm font-medium">评估标准:</h6>
                            {Object.entries(category.criteria).map(([critId, criterion]: [string, Criterion]) => (
                              <div key={critId} className="p-3 bg-background rounded border border-border">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-foreground text-sm font-medium">{criterion.name}</span>
                                  <div className="flex space-x-2">
                                    <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                                      权重 {criterion.weight}
                                    </Badge>
                                    <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                                      {criterion.score_range?.[0]}-{criterion.score_range?.[1]}分
                                    </Badge>
                                  </div>
                                </div>
                                {criterion.description && (
                                  <p className="text-muted-foreground text-xs">{criterion.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="json">
              <ScrollArea className="h-96 w-full">
                <pre className="text-muted-foreground text-sm bg-secondary p-4 rounded border border-border overflow-x-auto">
                  {formatJson(standard.evaluation_system)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
