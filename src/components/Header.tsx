
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, BarChart3, Sparkles, Globe } from 'lucide-react';
import { ApiSettings } from '@/components/ApiSettings';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  isApiDialogOpen: boolean;
  setIsApiDialogOpen: (open: boolean) => void;
  setIsEvaluationDialogOpen: (open: boolean) => void;
  setApiConfig: (config: any) => void;
}

export const Header = ({
  apiConfig,
  isApiDialogOpen,
  setIsApiDialogOpen,
  setIsEvaluationDialogOpen,
  setApiConfig
}: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-theme-pink to-theme-orange rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-gray-600 text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              className="border-gray-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'zh' ? 'EN' : '中文'}
            </Button>
            <Button
              onClick={() => setIsEvaluationDialogOpen(true)}
              className="bg-gradient-to-r from-theme-orange to-theme-yellow hover:from-orange-600 hover:to-yellow-600"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('header.evaluate')}
            </Button>
            <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('header.apiSettings')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('header.apiConfig')}</DialogTitle>
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
  );
};
