
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Settings, FileText, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EvaluationStandardBuilder } from '@/components/EvaluationStandardBuilder';
import { ApiSettings } from '@/components/ApiSettings';
import { JsonPreview } from '@/components/JsonPreview';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [evaluationStandard, setEvaluationStandard] = useState(null);
  const [apiConfig, setApiConfig] = useState({
    baseUrl: '',
    apiKey: ''
  });
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleExportJson = () => {
    if (!evaluationStandard) {
      toast({
        title: "无法导出",
        description: "请先生成评估标准",
        variant: "destructive"
      });
      return;
    }

    const dataStr = JSON.stringify(evaluationStandard, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'evaluation_standard.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "导出成功",
      description: "评估标准已保存为JSON文件",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">文章质量评估标准生成器</h1>
                <p className="text-gray-600 text-sm">智能生成定制化的内容评估体系</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-gray-300">
                    <Settings className="w-4 h-4 mr-2" />
                    API设置
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>API配置</DialogTitle>
                  </DialogHeader>
                  <ApiSettings 
                    config={apiConfig}
                    onConfigChange={(config) => {
                      setApiConfig(config);
                      setIsApiDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Button 
                onClick={handleExportJson}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!evaluationStandard}
              >
                <Download className="w-4 h-4 mr-2" />
                导出JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="builder" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              标准构建
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              预览导出
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <EvaluationStandardBuilder 
              onStandardGenerated={setEvaluationStandard}
              apiConfig={apiConfig}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <JsonPreview 
              evaluationStandard={evaluationStandard}
              onExport={handleExportJson}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
