import { useState, useEffect } from 'react';
import { EvaluationSystem } from '@/hooks/useStandards';

export interface ArticleEvaluation {
  id: string;
  article_title: string;
  article_content: string;
  standard_id: string;
  standard_name: string;
  total_score: number;
  evaluation_date: string;
  weight_in_parent?: number;
  categories?: string[];
  summary?: string;
  criteria?: EvaluationCriterion[];
  standard?: EvaluationSystem;
  group_key?: string;
}

export interface ArticleEvaluationGroup {
  article_title: string;
  article_content: string;
  evaluations: ArticleEvaluation[];
  average_score: number;
  evaluation_count: number;
  latest_date: string;
  id: string;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
  cite?: string[];
  standard?: EvaluationSystem;
}

export const useArticleEvaluations = () => {
  const [evaluations, setEvaluations] = useState<ArticleEvaluation[]>([]);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    try {
      const saved = localStorage.getItem('articleEvaluations_v1');
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
      localStorage.setItem('articleEvaluations_v1', JSON.stringify(newEvaluations));
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('Failed to save evaluations to localStorage:', error);
    }
  };

  const addEvaluation = (evaluation: Omit<ArticleEvaluation, 'id' | 'evaluation_date'>) => {
    const weight_in_parent = evaluation.weight_in_parent ?? 0;
    const newEvaluation: ArticleEvaluation = {
      ...evaluation,
      weight_in_parent,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      evaluation_date: new Date().toISOString(),
    };
    console.log('addEvaluation入参:', evaluation);
    console.log('addEvaluation生成的新对象:', newEvaluation);
    setEvaluations(prevEvaluations => {
      const newEvaluations = [newEvaluation, ...prevEvaluations];
      try {
        console.log('保存到localStorage的新评估列表:', newEvaluations);
        localStorage.setItem('articleEvaluations_v1', JSON.stringify(newEvaluations));
      } catch (error) {
        console.error('Failed to save evaluations to localStorage:', error);
      }
      return newEvaluations;
    });
    console.log('addEvaluation返回新id:', newEvaluation.id);
    return newEvaluation.id;
  };

  const addEvaluations = (evaluationsToAdd: Omit<ArticleEvaluation, 'id' | 'evaluation_date'>[]) => {
    const newEvaluations = evaluationsToAdd.map(evaluation => {
      const weight_in_parent = evaluation.weight_in_parent ?? 0;
      const obj = {
        ...evaluation,
        weight_in_parent,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        evaluation_date: new Date().toISOString(),
        group_key: evaluation.group_key,
      };
      console.log('addEvaluations单条入参:', evaluation);
      console.log('addEvaluations生成的新对象:', obj);
      return obj;
    });
    setEvaluations(prevEvaluations => {
      const combinedEvaluations = [...newEvaluations, ...prevEvaluations];
      const uniqueEvaluationsMap = new Map<string, ArticleEvaluation>();
      combinedEvaluations.forEach(evaluation => {
        const key = `${evaluation.article_title}|${evaluation.standard_id}|${evaluation.group_key}`;
        if (!uniqueEvaluationsMap.has(key)) {
          uniqueEvaluationsMap.set(key, evaluation);
        }
      });
      const allEvaluations = Array.from(uniqueEvaluationsMap.values());
      try {
        console.log('批量保存到localStorage的新评估列表:', allEvaluations);
        localStorage.setItem('articleEvaluations_v1', JSON.stringify(allEvaluations));
      } catch (error) {
        console.error('Failed to save evaluations to localStorage:', error);
      }
      return allEvaluations;
    });
    return newEvaluations.map(e => e.group_key!);
  };

  const deleteEvaluation = (id: string) => {
    const newEvaluations = evaluations.filter(e => e.id !== id);
    saveEvaluations(newEvaluations);
  };

  const deleteArticleGroup = (articleId: string) => {
    const group = getArticleGroup(articleId);
    if (group) {
      const evaluationIds = group.evaluations.map(e => e.id);
      const newEvaluations = evaluations.filter(e => !evaluationIds.includes(e.id));
      saveEvaluations(newEvaluations);
    }
  };

  const getEvaluation = (id: string) => {
    return evaluations.find(e => e.id === id);
  };

  const getArticleGroups = (): ArticleEvaluationGroup[] => {
    const groups = new Map<string, ArticleEvaluationGroup>();
    evaluations.forEach(evaluation => {
      const key = evaluation.group_key || 'unknown';
      if (groups.has(key)) {
        const group = groups.get(key)!;
        group.evaluations.push(evaluation);
        group.evaluation_count++;
        const totalScore = group.evaluations.reduce((sum, e) => sum + e.total_score, 0);
        group.average_score = Math.round(totalScore / group.evaluation_count);
        if (evaluation.evaluation_date > group.latest_date) {
          group.latest_date = evaluation.evaluation_date;
        }
      } else {
        groups.set(key, {
          id: key,
          article_title: evaluation.article_title,
          article_content: evaluation.article_content,
          evaluations: [evaluation],
          average_score: evaluation.total_score,
          evaluation_count: 1,
          latest_date: evaluation.evaluation_date,
        });
      }
    });
    return Array.from(groups.values()).sort((a, b) =>
      new Date(b.latest_date).getTime() - new Date(a.latest_date).getTime()
    );
  };

  const getArticleGroup = (articleId: string): ArticleEvaluationGroup | undefined => {
    const groups = getArticleGroups();
    return groups.find(group => group.id === articleId);
  };

  return {
    evaluations,
    addEvaluation,
    addEvaluations,
    deleteEvaluation,
    deleteArticleGroup,
    getEvaluation,
    getArticleGroups,
    getArticleGroup,
  };
};
