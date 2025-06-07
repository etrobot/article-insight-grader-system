
import { useState, useEffect } from 'react';

export interface ArticleEvaluation {
  id: string;
  article_title: string;
  article_content: string;
  standard_id: string;
  standard_name: string;
  total_score: number;
  evaluation_date: string;
  categories?: any[];
  summary?: string;
  suggestions?: string[];
}

export const useArticleEvaluations = () => {
  const [evaluations, setEvaluations] = useState<ArticleEvaluation[]>([]);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    try {
      const saved = localStorage.getItem('articleEvaluations');
      if (saved) {
        const parsedEvaluations = JSON.parse(saved);
        setEvaluations(parsedEvaluations);
      }
    } catch (error) {
      console.error('Failed to load evaluations from localStorage:', error);
    }
  };

  const saveEvaluations = (newEvaluations: ArticleEvaluation[]) => {
    try {
      localStorage.setItem('articleEvaluations', JSON.stringify(newEvaluations));
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('Failed to save evaluations to localStorage:', error);
    }
  };

  const addEvaluation = (evaluation: Omit<ArticleEvaluation, 'id' | 'evaluation_date'>) => {
    const newEvaluation: ArticleEvaluation = {
      ...evaluation,
      id: Date.now().toString(),
      evaluation_date: new Date().toISOString(),
    };
    const newEvaluations = [newEvaluation, ...evaluations];
    saveEvaluations(newEvaluations);
    return newEvaluation.id;
  };

  const deleteEvaluation = (id: string) => {
    const newEvaluations = evaluations.filter(e => e.id !== id);
    saveEvaluations(newEvaluations);
  };

  const getEvaluation = (id: string) => {
    return evaluations.find(e => e.id === id);
  };

  return {
    evaluations,
    addEvaluation,
    deleteEvaluation,
    getEvaluation,
  };
};
