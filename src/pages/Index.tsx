
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, FileText, Sparkles, List, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EvaluationStandardBuilder } from '@/components/EvaluationStandardBuilder';
import { ApiSettings } from '@/components/ApiSettings';
import { StandardsList } from '@/components/StandardsList';
import { StandardDetail } from '@/components/StandardDetail';
import { ArticleEvaluationDialog } from '@/components/ArticleEvaluationDialog';
import { EvaluationResult } from '@/components/EvaluationResult';
import { useStandards } from '@/hooks/useStandards';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { standards, addStandard, deleteStandard, getStandard } = useStandards();
  const [apiConfig, setApiConfig] = useState(() => {
    // Try to load config from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('apiSettingsConfig');
      console.log("Index.tsx: Loading apiConfig from localStorage - Raw savedConfig:", savedConfig);
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          console.log("Index.tsx: Loading apiConfig from localStorage - Parsed config:", parsedConfig);
          return parsedConfig;
        } catch (e) {
          console.error("Index.tsx: Failed to parse saved API config from localStorage:", e);
        }
      }
    }
    // Default initial state if no saved config or parse failed
    console.log("Index.tsx: Initializing apiConfig with default values.");
    return {
      baseUrl: '',
      apiKey: '',
      model: ''
    };
  });
  const [activeTab, setActiveTab] = useState('builder');
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const { toast } = useToast();

  // Save config to localStorage whenever it changes
  useEffect(() => {
    console.log("Index.tsx: Saving apiConfig to localStorage:", apiConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiSettingsConfig', JSON.stringify(apiConfig));
    }
  }, [apiConfig]);

  const handleStandardGenerated = (standardData: any) => {
    const newStandardId = addStandard(standardData);
    setActiveTab('preview');
    setSelectedStandardId(newStandardId);
  };

  const handleViewStandard = (id: string) => {
    setSelectedStandardId(id);
    setEvaluationResult(null);
  };

  const handleBackToList = () => {
    setSelectedStandardId(null);
    setEvaluationResult(null);
  };

  const handleEvaluationComplete = (result: any) => {
    setEvaluationResult(result);
    setActiveTab('preview');
  };

  const handleBackToEvaluationList = () => {
    setEvaluationResult(null);
  };

  const selectedStandard = selectedStandardId ? getStandard(selectedStandardId) : null;

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
              <Button
                onClick={() => setIsEvaluationDialogOpen(true)}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                评估文章
              </Button>
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'preview') {
            setSelectedStandardId(null);
            setEvaluationResult(null);
          }
        }} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="builder" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              标准构建
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <List className="w-4 h-4 mr-2" />
              标准列表
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <EvaluationStandardBuilder
              onStandardGenerated={handleStandardGenerated}
              apiConfig={apiConfig}
              onTabChange={setActiveTab}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {evaluationResult ? (
              <EvaluationResult
                result={evaluationResult}
                onBack={handleBackToEvaluationList}
              />
            ) : selectedStandard ? (
              <StandardDetail
                standard={selectedStandard}
                onBack={handleBackToList}
              />
            ) : (
              <StandardsList
                standards={standards}
                onDelete={deleteStandard}
                onView={handleViewStandard}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 评估文章对话框 */}
      <ArticleEvaluationDialog
        open={isEvaluationDialogOpen}
        onOpenChange={setIsEvaluationDialogOpen}
        standards={standards}
        apiConfig={apiConfig}
        onEvaluationComplete={handleEvaluationComplete}
      />
    </div>
  );
};

export default Index;
