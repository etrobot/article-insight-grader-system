
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { AiStandardDialog } from '@/components/AiStandardDialog';

interface EvaluationStandardBuilderProps {
  onStandardGenerated: (standard: any) => void;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
  };
}

export const EvaluationStandardBuilder = ({ onStandardGenerated, apiConfig }: EvaluationStandardBuilderProps) => {
  return (
    <div className="space-y-6">
      {/* AI生成区域 */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-gray-900 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>AI智能生成评估标准</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            只需填写系统名称和描述，AI将为您生成专业的评估标准体系
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">开始创建您的评估标准</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                AI将根据您的需求，自动生成包含多个评估维度、合理权重分配的专业评估标准
              </p>
              <AiStandardDialog 
                apiConfig={apiConfig}
                onStandardGenerated={onStandardGenerated}
              />
            </div>
          </div>
          
          {/* 功能特点 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">智能分析</h4>
              <p className="text-sm text-gray-600">AI分析您的需求，生成适合的评估维度</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">权重优化</h4>
              <p className="text-sm text-gray-600">自动调整各项指标权重，确保科学合理</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">即时生成</h4>
              <p className="text-sm text-gray-600">几秒钟内生成完整的评估标准体系</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">使用指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">配置API</h5>
                <p className="text-sm text-gray-600">点击右上角"API设置"配置您的OpenAI兼容API</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">填写信息</h5>
                <p className="text-sm text-gray-600">点击"添加标准"按钮，填写系统名称和描述</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">AI生成</h5>
                <p className="text-sm text-gray-600">AI将自动生成专业的评估标准，可在预览页面查看和导出</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
