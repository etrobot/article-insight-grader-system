
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
  };
  onConfigChange: (config: { baseUrl: string; apiKey: string }) => void;
}

export const ApiSettings = ({ config, onConfigChange }: ApiSettingsProps) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
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

  const handleInputChange = (field: 'baseUrl' | 'apiKey', value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
    setIsConnected(null); // 重置连接状态
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>OpenAI兼容API配置</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            配置与OpenAI API兼容的服务端点，用于智能评估标准生成
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 连接状态指示器 */}
          {isConnected !== null && (
            <Alert className={`border ${isConnected ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <AlertDescription className={isConnected ? 'text-green-300' : 'text-red-300'}>
                  {isConnected ? 'API连接正常，可以使用智能功能' : 'API连接失败，请检查配置'}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* API配置表单 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl" className="text-white">API Base URL</Label>
              <Input
                id="baseUrl"
                type="url"
                value={localConfig.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://api.openai.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400">
                支持OpenAI官方API或兼容格式的第三方API服务
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="sk-..."
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400">
                您的API密钥将仅在本地存储，不会上传到服务器
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <Button
              onClick={testConnection}
              disabled={isTesting || !localConfig.baseUrl || !localConfig.apiKey}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
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

      {/* 支持的API服务商 */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>支持的API服务</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">官方服务</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">OpenAI</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    推荐
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  https://api.openai.com
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">兼容服务</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Anthropic Claude</span>
                  <Badge variant="outline" className="border-white/20 text-slate-300">
                    兼容
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Local LLM</span>
                  <Badge variant="outline" className="border-white/20 text-slate-300">
                    兼容
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  支持所有OpenAI API格式的服务
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能说明 */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">AI增强功能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-white font-medium">智能标准生成</h5>
                <p className="text-sm text-slate-400">
                  根据您的需求自动生成专业的评估标准体系
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-white font-medium">标准优化建议</h5>
                <p className="text-sm text-slate-400">
                  分析评估标准的合理性并提供改进建议
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h5 className="text-white font-medium">自动权重调整</h5>
                <p className="text-sm text-slate-400">
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
