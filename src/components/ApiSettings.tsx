import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiSettingsProps {
  config: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  onConfigChange: (config: { baseUrl: string; apiKey: string; model: string }) => void;
}

export const ApiSettings = ({ config, onConfigChange }: ApiSettingsProps) => {
  const [localConfig, setLocalConfig] = useState(() => ({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    model: config.model || '',
  }));
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    console.log("handleSave: Saving API configuration with localConfig:", localConfig);
    onConfigChange(localConfig);
    toast({
      title: "设置已保存",
      description: "API配置已更新",
    });
  };

  const testConnection = async () => {
    if (!localConfig.baseUrl || !localConfig.apiKey) {
      toast({
        title: "配置不完整",
        description: "请填写完整的API地址和密钥",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch(`${localConfig.baseUrl}/v1/models`, {
        headers: {
          'Authorization': `Bearer ${localConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "连接成功",
          description: "API连接测试通过",
        });
      } else {
        setIsConnected(false);
        toast({
          title: "连接失败",
          description: `HTTP ${response.status}: ${response.statusText}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "连接错误",
        description: "无法连接到API服务器",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInputChange = (field: 'baseUrl' | 'apiKey' | 'model', value: string) => {
    console.log(`handleInputChange: field=${field}, value=${value}`);
    setLocalConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      console.log("handleInputChange: New localConfig after update:", newConfig);
      return newConfig;
    });
    setIsConnected(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>OpenAI兼容API配置</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            配置与OpenAI API兼容的服务端点，用于智能评估标准生成
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 连接状态指示器 */}
          {isConnected !== null && (
            <Alert className={`border ${isConnected ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription className={isConnected ? 'text-green-700' : 'text-red-700'}>
                  {isConnected ? 'API连接正常，可以使用智能功能' : 'API连接失败，请检查配置'}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* API配置表单 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl" className="text-gray-700">API Base URL</Label>
              <Input
                id="baseUrl"
                type="url"
                value={localConfig.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://api.openai.com"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500">
                支持OpenAI官方API或兼容格式的第三方API服务
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-gray-700">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="sk-..."
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500">
                您的API密钥将仅在本地存储，不会上传到服务器
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-700">Model</Label>
              <Input
                id="model"
                type="text"
                value={localConfig.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="gpt-3.5-turbo"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500">
                用于智能功能的AI模型名称 (例如: gpt-3.5-turbo, claude-3-opus-20240229)
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <Button
              onClick={testConnection}
              disabled={isTesting || !localConfig.baseUrl || !localConfig.apiKey}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? '测试中...' : '测试连接'}
            </Button>

            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              保存配置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 功能说明 */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">AI增强功能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-gray-900 font-medium">智能标准生成</h5>
                <p className="text-sm text-gray-600">
                  根据您的需求自动生成专业的评估标准体系
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-gray-900 font-medium">标准优化建议</h5>
                <p className="text-sm text-gray-600">
                  分析评估标准的合理性并提供改进建议
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-gray-900 font-medium">自动权重调整</h5>
                <p className="text-sm text-gray-600">
                  根据评估目标智能调整各项指标的权重分配
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
