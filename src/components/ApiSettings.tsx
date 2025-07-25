import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, TestTube, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApiSettingsProps {
  config: {
    baseUrl: string;
    apiKey: string;
    model: string;
    model2?: string;
  };
  onConfigChange: (config: { baseUrl: string; apiKey: string; model: string; model2?: string }) => void;
}

export const ApiSettings = ({ config, onConfigChange }: ApiSettingsProps) => {
  const { t } = useLanguage();
  const [localConfig, setLocalConfig] = useState(() => ({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    model: config.model || '',
    model2: config.model2 || '',
  }));
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    console.log("handleSave: Saving API configuration with localConfig:", localConfig);
    onConfigChange(localConfig);
    toast({
      title: t('api.settingsSaved'),
      description: t('api.settingsSavedDesc'),
    });
  };

  const testConnection = async () => {
    if (!localConfig.baseUrl || !localConfig.apiKey) {
      toast({
        title: t('api.configIncomplete'),
        description: t('api.configIncompleteDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch(`${localConfig.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${localConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: t('api.connectionSuccessTitle'),
          description: t('api.connectionSuccessDesc'),
        });
      } else {
        setIsConnected(false);
        toast({
          title: t('api.connectionFailedTitle'),
          description: `HTTP ${response.status}: ${response.statusText}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsConnected(false);
      toast({
        title: t('api.connectionErrorTitle'),
        description: t('api.connectionErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInputChange = (field: 'baseUrl' | 'apiKey' | 'model' | 'model2', value: string) => {
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
      <Card className="border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t('api.title')}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t('api.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection status indicator */}
          {isConnected !== null && (
            <Alert className={`border ${isConnected ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'}`}>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <AlertDescription className={isConnected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                  {isConnected ? t('api.connectionSuccess') : t('api.connectionFailed')}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* API configuration form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl" className="text-gray-700 dark:text-gray-300">{t('api.baseUrl')}</Label>
              <Input
                id="baseUrl"
                type="url"
                value={localConfig.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder={t('api.baseUrlPlaceholder')}
                className="border-gray-300 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('api.baseUrlHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-gray-700 dark:text-gray-300">{t('api.apiKey')}</Label>
              <Input
                id="apiKey"
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder={t('api.apiKeyPlaceholder')}
                className="border-gray-300 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('api.apiKeyHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-700 dark:text-gray-300">{t('api.model')}</Label>
              <Input
                id="model"
                type="text"
                value={localConfig.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder={t('api.modelPlaceholder')}
                className="border-gray-300 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('api.modelHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model2" className="text-gray-700 dark:text-gray-300">Model 2</Label>
              <Input
                id="model2"
                type="text"
                value={localConfig.model2}
                onChange={(e) => handleInputChange('model2', e.target.value)}
                placeholder="备用模型名称"
                className="border-gray-300 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                可选，备用模型名称
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={testConnection}
              disabled={isTesting || !localConfig.baseUrl || !localConfig.apiKey}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? t('api.testing') : t('api.testConnection')}
            </Button>

            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {t('api.saveConfig')}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
