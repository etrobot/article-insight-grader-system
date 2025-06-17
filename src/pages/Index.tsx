import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabsContainer } from '@/components/TabsContainer';
import { ArticleEvaluationDialog } from '@/components/ArticleEvaluationDialog';
import { useStandards, EvaluationSystem } from '@/hooks/useStandards';
import { useArticleEvaluations } from '@/hooks/useArticleEvaluations';
import { useToast } from '@/hooks/use-toast';
import { EvaluationResult } from '@/components/evaluation-dialog/types';
import { ArticleEvaluation } from '@/hooks/useArticleEvaluations';

const Index = () => {
  const { standards, addStandard, deleteStandard, getStandard, updateStandard } = useStandards();
  const {
    evaluations,
    addEvaluation,
    deleteEvaluation,
    deleteArticleGroup,
    getEvaluation,
    getArticleGroups,
    getArticleGroup,
    addEvaluations
  } = useArticleEvaluations();

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
  const [selectedArticleGroupId, setSelectedArticleGroupId] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Index.tsx: Saving apiConfig to localStorage:", apiConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiSettingsConfig', JSON.stringify(apiConfig));
    }
  }, [apiConfig]);

  const handleStandardGenerated = (standardData: Omit<EvaluationSystem, 'id' | 'createdAt'>) => {
    const newStandardId = addStandard(standardData);
    setActiveTab('preview');
    setSelectedStandardId(newStandardId);
  };

  const handleViewStandard = (id: string) => {
    setSelectedStandardId(id);
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
    setSelectedArticleGroupId(null);
  };

  const handleViewEvaluation = (id: string) => {
    setSelectedEvaluationId(id);
    setSelectedStandardId(null);
    setEvaluationResult(null);
    setSelectedArticleGroupId(null);
  };

  const handleViewArticleGroup = (articleId: string) => {
    setSelectedArticleGroupId(articleId);
    setSelectedStandardId(null);
    setSelectedEvaluationId(null);
    setEvaluationResult(null);
  };

  const handleBackToList = () => {
    setSelectedStandardId(null);
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
  };

  const handleBackToEvaluationList = () => {
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
  };

  const handleBackToArticleList = () => {
    setSelectedArticleGroupId(null);
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
  };

  const handleEvaluationComplete = (results: EvaluationResult | EvaluationResult[], groupKey?: string) => {
    const resultArr = Array.isArray(results) ? results : [results];
    console.log('Index.tsx: 批量保存评估结果:', resultArr, 'groupKey:', groupKey);
    const evaluations = resultArr.map(result => ({
      article_title: result.article_title,
      article_content: result.article_content || '',
      standard_id: result.standard?.id || '',
      standard_name: result.standard?.name || '',
      total_score: result.total_score,
      summary: result.summary,
      criteria: result.criteria,
      group_key: groupKey,
      weight_in_parent: result.weight_in_parent ?? result.standard?.weight_in_parent ?? 0,
    }));
    console.log('Index.tsx: evaluations待保存的weight_in_parent:', evaluations.map(e => e.weight_in_parent));
    const ids = addEvaluations(evaluations);
    const groupId = groupKey || ids[0];
    console.log('Index.tsx: 评估完成后跳转到文章评估详情, groupId:', groupId);
    setEvaluationResult(null);
    setSelectedEvaluationId(null);
    setSelectedArticleGroupId(groupId || null);
    setActiveTab('evaluations');
  };

  const selectedStandard = selectedStandardId ? getStandard(selectedStandardId) : null;
  const selectedEvaluation = selectedEvaluationId ? getEvaluation(selectedEvaluationId) : null;
  const selectedArticleGroup = selectedArticleGroupId ? getArticleGroup(selectedArticleGroupId) : null;
  const articleGroups = getArticleGroups();

  return (
    <div className="min-h-screen max-w-5xl mx-auto from-theme-pink-light via-theme-yellow-light to-theme-orange-light dark:from-theme-pink-light dark:via-theme-yellow-light dark:to-theme-orange-light">
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
          articleGroups={articleGroups}
          selectedArticleGroup={selectedArticleGroup}
          onViewArticleGroup={handleViewArticleGroup}
          onBackToArticleList={handleBackToArticleList}
          deleteArticleGroup={deleteArticleGroup}
          onUpdateStandard={updateStandard}
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
