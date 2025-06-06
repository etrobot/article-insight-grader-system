
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Download, 
  Copy, 
  FileJson, 
  BarChart3, 
  Settings2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonPreviewProps {
  evaluationStandard: any;
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

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const getSystemStats = () => {
    if (!evaluationStandard?.evaluation_system) return null;
    
    const system = evaluationStandard.evaluation_system;
    const categories = Object.values(system.categories || {}) as any[];
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
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-full">
            <FileJson className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-center">
            <h3 className="text-white text-lg font-medium">暂无评估标准</h3>
            <p className="text-slate-400 text-sm mt-2">
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
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">{stats.categoriesCount}</p>
                  <p className="text-slate-400 text-sm">评估类别</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">{stats.criteriaCount}</p>
                  <p className="text-slate-400 text-sm">评估标准</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">{stats.totalWeight}</p>
                  <p className="text-slate-400 text-sm">总权重</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white font-medium">v{stats.version}</p>
                  <p className="text-slate-400 text-sm">版本号</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 预览内容 */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>评估标准预览</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                查看生成的评估标准详细内容
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
              <Button
                onClick={onExport}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structured" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-black/20 border border-white/10">
              <TabsTrigger value="structured" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                结构化视图
              </TabsTrigger>
              <TabsTrigger value="json" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                JSON格式
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structured" className="space-y-4">
              {evaluationStandard?.evaluation_system && (
                <div className="space-y-6">
                  {/* 系统信息 */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {evaluationStandard.evaluation_system.name}
                    </h3>
                    {evaluationStandard.evaluation_system.description && (
                      <p className="text-slate-300 text-sm mb-3">
                        {evaluationStandard.evaluation_system.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        版本 {evaluationStandard.evaluation_system.version}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        总权重 {evaluationStandard.evaluation_system.total_weight}
                      </Badge>
                    </div>
                  </div>

                  {/* 评估类别 */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">评估类别详情</h4>
                    {Object.entries(evaluationStandard.evaluation_system.categories || {}).map(([catId, category]: [string, any]) => (
                      <div key={catId} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-white font-medium">{category.name}</h5>
                          <Badge variant="outline" className="border-white/20 text-slate-300">
                            权重 {category.weight}%
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-slate-400 text-sm">{category.description}</p>
                        )}
                        
                        {/* 评估标准 */}
                        {category.criteria && Object.keys(category.criteria).length > 0 && (
                          <div className="space-y-2">
                            <h6 className="text-slate-300 text-sm font-medium">评估标准:</h6>
                            {Object.entries(category.criteria).map(([critId, criterion]: [string, any]) => (
                              <div key={critId} className="p-3 bg-black/20 rounded border border-white/5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white text-sm font-medium">{criterion.name}</span>
                                  <div className="flex space-x-2">
                                    <Badge variant="outline" className="border-white/20 text-slate-300 text-xs">
                                      权重 {criterion.weight}
                                    </Badge>
                                    <Badge variant="outline" className="border-white/20 text-slate-300 text-xs">
                                      {criterion.score_range?.[0]}-{criterion.score_range?.[1]}分
                                    </Badge>
                                  </div>
                                </div>
                                {criterion.description && (
                                  <p className="text-slate-400 text-xs">{criterion.description}</p>
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
                <pre className="text-slate-300 text-sm bg-black/40 p-4 rounded border border-white/10 overflow-x-auto">
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
