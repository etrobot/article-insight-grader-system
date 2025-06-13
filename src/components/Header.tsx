
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, BarChart3, Sparkles, Globe, Sun, Moon } from 'lucide-react';
import { ApiSettings } from '@/components/ApiSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-theme-pink to-theme-orange rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-gray-100">{t('app.title')}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  {t('header.language')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('zh')}>
                  {t('common.chinese')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  {t('common.english')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsEvaluationDialogOpen(true)}
              className="bg-gradient-to-r from-theme-orange to-theme-yellow hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2 text-white" />
              {t('header.evaluate')}
            </Button>

            <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 dark:border-gray-600">
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

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-gray-300 dark:border-gray-600"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
