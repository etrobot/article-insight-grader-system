import { useState, useEffect } from 'react';
import { Standard } from '@/hooks/useStandards';

export interface ArticleEvaluation {
  id: string;
  article_title: string;
  article_content: string;
  standard_id: string;
  standard_name: string;
  total_score: number;
  evaluation_date: string;
  categories?: string[];
  summary?: string;
  criteria?: EvaluationCriterion[];
}

export interface ArticleEvaluationGroup {
  article_title: string;
  article_content: string;
  evaluations: ArticleEvaluation[];
  average_score: number;
  evaluation_count: number;
  latest_date: string;
  id: string; // 基于内容标题生成的唯一ID
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
  standard?: Standard;
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      evaluation_date: new Date().toISOString(),
    };
    setEvaluations(prevEvaluations => {
      const newEvaluations = [newEvaluation, ...prevEvaluations];
      try {
        console.log('保存到localStorage的新评估列表:', newEvaluations);
        localStorage.setItem('articleEvaluations', JSON.stringify(newEvaluations));
      } catch (error) {
        console.error('Failed to save evaluations to localStorage:', error);
      }
      return newEvaluations;
    });
    console.log('addEvaluation返回新id:', newEvaluation.id);
    return newEvaluation.id;
  };

  const addEvaluations = (evaluationsToAdd: Omit<ArticleEvaluation, 'id' | 'evaluation_date'>[]) => {
    const newEvaluations = evaluationsToAdd.map(evaluation => ({
      ...evaluation,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      evaluation_date: new Date().toISOString(),
    }));
    setEvaluations(prevEvaluations => {
      const combinedEvaluations = [...newEvaluations, ...prevEvaluations];
      const uniqueEvaluationsMap = new Map<string, ArticleEvaluation>();
      combinedEvaluations.forEach(evaluation => {
        const key = `${evaluation.article_title}|${evaluation.standard_id}`;
        if (!uniqueEvaluationsMap.has(key)) {
          uniqueEvaluationsMap.set(key, evaluation);
        }
      });
      const allEvaluations = Array.from(uniqueEvaluationsMap.values());

      try {
        console.log('批量保存到localStorage的新评估列表:', allEvaluations);
        localStorage.setItem('articleEvaluations', JSON.stringify(allEvaluations));
      } catch (error) {
        console.error('Failed to save evaluations to localStorage:', error);
      }
      return allEvaluations;
    });
    return newEvaluations.map(e => e.id);
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

  // 生成内容分组数据
  const getArticleGroups = (): ArticleEvaluationGroup[] => {
    const groups = new Map<string, ArticleEvaluationGroup>();

    evaluations.forEach(evaluation => {
      const key = evaluation.article_content.trim();

      if (groups.has(key)) {
        const group = groups.get(key)!;
        group.evaluations.push(evaluation);
        group.evaluation_count++;

        // 更新平均分
        const totalScore = group.evaluations.reduce((sum, e) => sum + e.total_score, 0);
        group.average_score = Math.round(totalScore / group.evaluation_count);

        // 更新最新日期
        if (evaluation.evaluation_date > group.latest_date) {
          group.latest_date = evaluation.evaluation_date;
        }
      } else {
        groups.set(key, {
          id: evaluation.id,
          article_title: evaluation.article_title,
          article_content: evaluation.article_content,
          evaluations: [evaluation],
          average_score: evaluation.total_score,
          evaluation_count: 1,
          latest_date: evaluation.evaluation_date,
        });
      }
    });

    // 按最新日期排序
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
