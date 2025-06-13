import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Download,
  Copy,
  FileJson,
  BarChart3,
  Settings2,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Standard, Criterion } from '@/hooks/useStandards';
import { JsonEditor } from '@/components/JsonEditor';

interface StandardDetailProps {
  standard: Standard;
  onBack: () => void;
  onUpdate?: (updatedStandard: Standard) => void;
}

export const StandardDetail = ({ standard, onBack, onUpdate }: StandardDetailProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState(standard.evaluation_system);

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

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedJson(standard.evaluation_system);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    try {
      if (onUpdate) {
        const updatedStandard = {
          ...standard,
          evaluation_system: editedJson
        };
        onUpdate(updatedStandard);
      }
      setIsEditing(false);
      toast({
        title: "保存成功",
        description: "评估标准已更新",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "JSON格式有误，请检查语法",
        variant: "destructive",
      });
    }
  };

  const formatJson = (obj: object) => {
    return JSON.stringify(obj, null, 2);
  };

  const getSystemStats = () => {
    const system = standard.evaluation_system;
    const criteria: Criterion[] = Array.isArray(system.criteria) ? system.criteria : [];
    return {
      criteriaCount: criteria.length,
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
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
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
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="w-full">
              <JsonEditor
                value={editedJson}
                onChange={setEditedJson}
                height="600px"
              />
            </div>
          ) : (
            <ScrollArea className="h-[600px] rounded-md border border-border">
              <div className="p-4 space-y-6">
                {standard.evaluation_system && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{standard.evaluation_system.name}</h3>
                      {standard.evaluation_system.description && (
                        <p className="text-muted-foreground">
                          {standard.evaluation_system.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>版本 {standard.evaluation_system.version}</span>
                        <span>总权重 {standard.evaluation_system.total_weight}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-semibold">评估标准</h4>
                      {Array.isArray(standard.evaluation_system.criteria) && standard.evaluation_system.criteria.map((criterion: Criterion) => (
                        <Card key={criterion.id} className="bg-card/50 border-border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium">{criterion.name}</h5>
                                  <Badge variant="secondary" className="text-xs">
                                    权重: {criterion.weight}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  {Object.entries(criterion.description).map(([score, desc]) => (
                                    <div key={score} className="flex items-start space-x-2">
                                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                                        {score}分
                                      </Badge>
                                      <p className="text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                评分范围: {criterion.score_range[0]}-{criterion.score_range[1]}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-md font-semibold">评分算法</h4>
                      <Card className="bg-card/50 border-border">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {standard.evaluation_system.scoring_algorithm.description}
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="font-medium">计算公式：</span>
                              <code className="bg-secondary px-2 py-1 rounded">
                                {standard.evaluation_system.scoring_algorithm.formula}
                              </code>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {standard.evaluation_system.scoring_algorithm.normalization}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
