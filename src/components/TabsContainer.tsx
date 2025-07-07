import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, List, History } from 'lucide-react';
import { EvaluationStandardBuilder } from '@/components/EvaluationStandardBuilder';
import { StandardsList } from '@/components/StandardsList';
import { StandardDetail } from '@/components/StandardDetail';
import type { ArticleEvaluationGroup } from '@/hooks/useArticleEvaluations';
import type { EvaluationResult as DialogEvaluationResult } from './evaluation-dialog/types';
import type { EvaluationResult as ComponentEvaluationResult } from '@/components/EvaluationResult';
import { EvaluationResult } from '@/components/EvaluationResult';
import { ArticleGroupsList } from '@/components/ArticleGroupsList';
import { ArticleEvaluationsDetail } from '@/components/ArticleEvaluationsDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { EvaluationSystem } from '@/hooks/useStandards';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  standards: EvaluationSystem[];
  evaluations: unknown[];
  selectedStandard: EvaluationSystem | null;
  selectedEvaluation: unknown;
  evaluationResult: DialogEvaluationResult | null;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
    model2?: string;
  };
  onStandardGenerated: (data: EvaluationSystem) => void;
  onViewStandard: (id: string) => void;
  onViewEvaluation: (id: string) => void;
  onBackToList: () => void;
  onBackToEvaluationList: () => void;
  deleteStandard: (id: string) => void;
  deleteEvaluation: (id: string) => void;
  // 新增的props
  articleGroups: ArticleEvaluationGroup[];
  selectedArticleGroup: ArticleEvaluationGroup | null;
  onViewArticleGroup: (articleId: string) => void;
  onBackToArticleList: () => void;
  deleteArticleGroup: (articleId: string) => void;
  // 新增onUpdateStandard
  onUpdateStandard: (std: EvaluationSystem) => void;
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
  deleteEvaluation,
  articleGroups,
  selectedArticleGroup,
  onViewArticleGroup,
  onBackToArticleList,
  deleteArticleGroup,
  onUpdateStandard
}: TabsContainerProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={(value) => {
      setActiveTab(value);
      if (value === 'preview') {
        onBackToList();
      } else if (value === 'evaluations') {
        onBackToEvaluationList();
        onBackToArticleList();
      }
    }} className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto border border-gray-200 shadow-sm">
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
            onUpdate={onUpdateStandard}
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
            result={{
              ...evaluationResult,
              standard_name: evaluationResult.standard?.name || ''
            }}
            onBack={onBackToEvaluationList}
          />
        ) : selectedEvaluation ? (
          <EvaluationResult
            result={{
              ...(selectedEvaluation as DialogEvaluationResult),
              standard_name: (selectedEvaluation as { standard?: { name: string } })?.standard?.name || ''
            }}
            onBack={onBackToEvaluationList}
          />
        ) : selectedArticleGroup ? (
          <ArticleEvaluationsDetail
            articleGroup={selectedArticleGroup}
            onBack={onBackToArticleList}
            onViewEvaluation={onViewEvaluation}
            onDeleteEvaluation={deleteEvaluation}
            onViewArticleGroup={onViewArticleGroup}
          />
        ) : (
          <ArticleGroupsList
            articleGroups={articleGroups}
            onView={onViewArticleGroup}
            onDelete={deleteArticleGroup}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
