import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  Copy,
  FileJson,
  Settings2,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EvaluationSystem, Criterion } from '@/hooks/useStandards';
import { JsonEditor } from '@/components/JsonEditor';

interface StandardDetailProps {
  standard: EvaluationSystem;
  onBack: () => void;
  onUpdate?: (updatedStandard: EvaluationSystem) => void;
}

export const StandardDetail = ({ standard, onBack, onUpdate }: StandardDetailProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState(standard);
  const jsonEditorRef = useRef<{ getValue: () => { jsObject: EvaluationSystem } | null }>(null);

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(standard, null, 2);
    navigator.clipboard.writeText(jsonString);

    toast({
      title: "已复制",
      description: "JSON内容已复制到剪贴板",
    });
  };

  const exportCsv = () => {
    // 创建CSV头部
    let csvContent = 'id,name,score,description\n';
    
    // 遍历所有标准项
    standard.criteria.forEach((criterion: Criterion) => {
      // 确保每个字段都转义引号并用引号包裹
      const escapeCsv = (field: any) => {
        const str = String(field || '');
        return `"${str.replace(/"/g, '""')}"`;
      };
      
      // 为每个评分等级创建一行
      if (criterion.description) {
        Object.entries(criterion.description).forEach(([score, desc]) => {
          const row = [
            criterion.id || '',
            criterion.name || '',
            score, // 评分等级
            desc   // 描述内容
          ].map(escapeCsv).join(',');
          
          csvContent += row + '\n';
        });
      } else {
        // 如果没有description，至少输出一行
        const row = [
          criterion.id || '',
          criterion.name || '',
          '', // 空评分
          ''  // 空描述
        ].map(escapeCsv).join(',');
        
        csvContent += row + '\n';
      }
    });
    
    // 创建CSV文件下载
    const dataUri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `${standard.name.replace(/\s+/g, '_')}_evaluation_standard.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "导出成功",
      description: "评估标准已保存为CSV文件",
    });
  };

  const handleEditToggle = () => {
    console.log('StandardDetail.handleEditToggle: isEditing=', isEditing, 'standard=', standard);
    if (isEditing) {
      setEditedJson(standard);
      console.log('StandardDetail.handleEditToggle: 取消编辑，重置editedJson为standard', standard);
    }
    setIsEditing(!isEditing);
    console.log('StandardDetail.handleEditToggle: 切换isEditing为', !isEditing);
  };

  const handleJsonEditorChange = (value: EvaluationSystem) => {
    console.log('StandardDetail.handleJsonEditorChange: 收到JsonEditor变更 value=', value);
    setEditedJson((prev) => {
      console.log('StandardDetail.setEditedJson: 旧值=', prev, '新值=', value);
      return value;
    });
  };

  const handleSave = () => {
    let latestJson = editedJson;
    if (jsonEditorRef.current && jsonEditorRef.current.getValue) {
      const raw = jsonEditorRef.current.getValue();
      if (raw && raw.jsObject) {
        latestJson = raw.jsObject;
        setEditedJson(latestJson);
        console.log('StandardDetail.handleSave: 主动从JsonEditor取值 latestJson=', latestJson);
      }
    }
    console.log('StandardDetail.handleSave: 尝试保存，latestJson=', latestJson, 'onUpdate=', onUpdate);
    if (!latestJson.id) {
      console.error('StandardDetail.handleSave: latestJson缺少id，无法更新', latestJson);
    }
    const beforeSave = JSON.stringify(latestJson);
    try {
      if (onUpdate) {
        onUpdate(latestJson);
        console.log('StandardDetail.handleSave: 已调用onUpdate，传递内容=', beforeSave);
      } else {
        console.warn('StandardDetail.handleSave: onUpdate未传入');
      }
      setIsEditing(false);
      toast({
        title: "保存成功",
        description: "评估标准已更新",
      });
    } catch (error) {
      console.error('StandardDetail.handleSave: 保存异常', error);
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
    const criteria: Criterion[] = Array.isArray(standard.criteria) ? standard.criteria : [];
    return {
      criteriaCount: criteria.length,
      totalWeight: standard.total_weight || 100,
      version: standard.version || "1.0"
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
          <div className="md:flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <FileJson className="w-5 h-5" />
                <span>评估标准详情</span>
              </CardTitle>
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
                    onClick={exportCsv}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出CSV
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
                ref={jsonEditorRef}
                value={editedJson}
                onChange={handleJsonEditorChange}
                height="600px"
              />
            </div>
          ) : (
              <div className="p-4 space-y-6">
                {standard && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{standard.name}</h3>
                      {standard.description && (
                        <p className="text-muted-foreground">
                          {standard.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>版本 {standard.version}</span>
                        <span>总权重 {standard.total_weight}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-semibold">评估点</h4>
                      {Array.isArray(standard.criteria) && standard.criteria.map((criterion: Criterion) => (
                        <Card key={criterion.id} className="bg-card/50 border-border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium">{criterion.name}</h5>
                                  <Badge variant="secondary" className="text-xs">
                                    权重: {criterion.weight}%
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
                             加权平均算法
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="font-medium">计算公式：</span>
                              <code className="bg-secondary px-2 py-1 rounded">
                               总分 = Σ(标准权重 × 标准得分)
                              </code>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              最终得分归一化到0-100分
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
