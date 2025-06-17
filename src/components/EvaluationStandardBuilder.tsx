import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { AiStandardDialog } from '@/components/AiStandardDialog';
import { EvaluationSystem } from '@/hooks/useStandards';

interface EvaluationStandardBuilderProps {
  onStandardGenerated: (standardData: EvaluationSystem) => void;
  onTabChange: (tab: string) => void;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
}

export const EvaluationStandardBuilder = ({ onStandardGenerated, apiConfig, onTabChange }: EvaluationStandardBuilderProps) => {
  const handleStandardGenerated = (standardData: EvaluationSystem) => {
    console.log('EvaluationStandardBuilder onStandardGenerated 入参:', standardData);
    onStandardGenerated(standardData);
    console.log('EvaluationStandardBuilder onStandardGenerated 出参:', standardData);
  };

  return (
    <div className="space-y-6">
      {/* AI生成区域 */}
      <Card className="border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>AI智能生成评估标准</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            只需填写标准名称和描述，AI将为您生成专业的评估标准体系
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-8  rounded-lg border border-blue-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4 ">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">开始创建您的评估标准</h3>
              <p className="text-gray-600 max-w-md mx-auto dark:text-gray-300 ">
                AI将根据您的需求，自动生成包含多个评估维度、合理权重分配的专业评估标准
              </p>
              <AiStandardDialog
                apiConfig={apiConfig}
                onStandardGenerated={handleStandardGenerated}
              />
            </div>
          </div>

          {/* 功能特点 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2 dark:text-gray-100">配置API</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">点击右上角"API设置"配置您的OpenAI兼容API</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2 dark:text-gray-100">填写信息</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">点击"添加标准"按钮，填写标准名称和描述</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2 dark:text-gray-100">AI生成</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI将自动生成专业的评估标准，可在预览页面查看和导出</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
