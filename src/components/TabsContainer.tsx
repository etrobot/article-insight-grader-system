
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, List, History } from 'lucide-react';
import { EvaluationStandardBuilder } from '@/components/EvaluationStandardBuilder';
import { StandardsList } from '@/components/StandardsList';
import { StandardDetail } from '@/components/StandardDetail';
import { EvaluationResult } from '@/components/EvaluationResult';
import { EvaluationsList } from '@/components/EvaluationsList';
import { useLanguage } from '@/contexts/LanguageContext';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  standards: any[];
  evaluations: any[];
  selectedStandard: any;
  selectedEvaluation: any;
  evaluationResult: any;
  apiConfig: any;
  onStandardGenerated: (data: any) => void;
  onViewStandard: (id: string) => void;
  onViewEvaluation: (id: string) => void;
  onBackToList: () => void;
  onBackToEvaluationList: () => void;
  deleteStandard: (id: string) => void;
  deleteEvaluation: (id: string) => void;
}

export const TabsContainer = ({
  activeTab,
  setActiveTab,
  standards,
  evaluations,
  selectedStandard,
  selectedEvaluation,
  evaluationResult,
  apiConfig,
  onStandardGenerated,
  onViewStandard,
  onViewEvaluation,
  onBackToList,
  onBackToEvaluationList,
  deleteStandard,
  deleteEvaluation
}: TabsContainerProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={(value) => {
      setActiveTab(value);
      if (value === 'preview') {
        onBackToList();
      } else if (value === 'evaluations') {
        onBackToEvaluationList();
      }
    }} className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto bg-white border border-gray-200 shadow-sm">
        <TabsTrigger value="builder" className="data-[state=active]:bg-theme-pink data-[state=active]:text-white">
          <FileText className="w-4 h-4 mr-2" />
          {t('tabs.builder')}
        </TabsTrigger>
        <TabsTrigger value="preview" className="data-[state=active]:bg-theme-pink data-[state=active]:text-white">
          <List className="w-4 h-4 mr-2" />
          {t('tabs.standards')}
        </TabsTrigger>
        <TabsTrigger value="evaluations" className="data-[state=active]:bg-theme-pink data-[state=active]:text-white">
          <History className="w-4 h-4 mr-2" />
          {t('tabs.evaluations')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="builder" className="space-y-6">
        <EvaluationStandardBuilder
          onStandardGenerated={onStandardGenerated}
          apiConfig={apiConfig}
          onTabChange={setActiveTab}
        />
      </TabsContent>

      <TabsContent value="preview" className="space-y-6">
        {selectedStandard ? (
          <StandardDetail
            standard={selectedStandard}
            onBack={onBackToList}
          />
        ) : (
          <StandardsList
            standards={standards}
            onDelete={deleteStandard}
            onView={onViewStandard}
          />
        )}
      </TabsContent>

      <TabsContent value="evaluations" className="space-y-6">
        {evaluationResult ? (
          <EvaluationResult
            result={evaluationResult}
            onBack={onBackToEvaluationList}
          />
        ) : selectedEvaluation ? (
          <EvaluationResult
            result={selectedEvaluation}
            onBack={onBackToEvaluationList}
          />
        ) : (
          <EvaluationsList
            evaluations={evaluations}
            onView={onViewEvaluation}
            onDelete={deleteEvaluation}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
