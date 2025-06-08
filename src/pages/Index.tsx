
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabsContainer } from '@/components/TabsContainer';
import { ArticleEvaluationDialog } from '@/components/ArticleEvaluationDialog';
import { useStandards } from '@/hooks/useStandards';
import { useArticleEvaluations } from '@/hooks/useArticleEvaluations';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { standards, addStandard, deleteStandard, getStandard } = useStandards();
  const { evaluations, addEvaluation, deleteEvaluation, getEvaluation } = useArticleEvaluations();
  
  const [apiConfig, setApiConfig] = useState(() => {
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
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const { toast } = useToast();

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
    setSelectedEvaluationId(null);
  };

  const handleViewEvaluation = (id: string) => {
    setSelectedEvaluationId(id);
    setSelectedStandardId(null);
    setEvaluationResult(null);
    setActiveTab('evaluations');
  };

  const handleBackToList = () => {
    setSelectedStandardId(null);
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
  };

  const handleEvaluationComplete = (result: any) => {
    addEvaluation({
      article_title: result.article_title,
      article_content: result.article_content || '',
      standard_id: result.standard?.id || '',
      standard_name: result.standard?.name || '',
      total_score: result.total_score,
      categories: result.categories,
      summary: result.summary,
      suggestions: result.suggestions
    });
    
    setEvaluationResult(result);
    setActiveTab('evaluations');
  };

  const handleBackToEvaluationList = () => {
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
  };

  const selectedStandard = selectedStandardId ? getStandard(selectedStandardId) : null;
  const selectedEvaluation = selectedEvaluationId ? getEvaluation(selectedEvaluationId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-pink-light via-theme-yellow-light to-theme-orange-light dark:from-theme-pink-light dark:via-theme-yellow-light dark:to-theme-orange-light">
      <Header
        apiConfig={apiConfig}
        isApiDialogOpen={isApiDialogOpen}
        setIsApiDialogOpen={setIsApiDialogOpen}
        setIsEvaluationDialogOpen={setIsEvaluationDialogOpen}
        setApiConfig={setApiConfig}
      />

      <div className="container mx-auto px-6 py-8">
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          standards={standards}
          evaluations={evaluations}
          selectedStandard={selectedStandard}
          selectedEvaluation={selectedEvaluation}
          evaluationResult={evaluationResult}
          apiConfig={apiConfig}
          onStandardGenerated={handleStandardGenerated}
          onViewStandard={handleViewStandard}
          onViewEvaluation={handleViewEvaluation}
          onBackToList={handleBackToList}
          onBackToEvaluationList={handleBackToEvaluationList}
          deleteStandard={deleteStandard}
          deleteEvaluation={deleteEvaluation}
        />
      </div>

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
