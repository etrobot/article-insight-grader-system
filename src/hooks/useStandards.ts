import { useState, useEffect } from 'react';
import { DEFAULT_STANDARDS } from '@/lib/standards';

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  score_range: number[];
  description: {
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
  };
}

export interface EvaluationSystem {
  name: string;
  description: string;
  version: string;
  total_weight: number;
  criteria: Criterion[];
  scoring_algorithm: {
    description: string;
    formula: string;
    normalization: string;
  };
  createdAt?: string;
  id?: string;
  weight_in_parent?: number;
}

export const useStandards = () => {
  const [standards, setStandards] = useState<EvaluationSystem[]>([]);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = () => {
    console.log("useStandards.loadStandards: 尝试从 localStorage 读取 evaluationStandards_v2");
    const saved = localStorage.getItem('evaluationStandards_v2');
    console.log("useStandards.loadStandards: localStorage 原始内容:", saved);
    if (saved === null) {
      // 初始化默认标准，补充 id/createdAt 字段
      const arr = DEFAULT_STANDARDS.map(std => {
        const newId = Math.random().toString(36).slice(2);
        console.log("useStandards.loadStandards: 生成新标准ID:", newId);
        return {
          ...std,
          id: newId,
          createdAt: new Date().toISOString(),
        };
      });
      localStorage.setItem('evaluationStandards_v2', JSON.stringify(arr));
      setStandards(arr);
      console.log("useStandards.loadStandards: 首次初始化全部标准，内容:", arr);
    } else {
      const parsedStandards = JSON.parse(saved);
      console.log("useStandards.loadStandards: 解析后标准:", parsedStandards);
      setStandards(parsedStandards);
    }
  };

  const saveStandards = (newStandards: EvaluationSystem[]) => {
    try {
      localStorage.setItem('evaluationStandards_v2', JSON.stringify(newStandards));
      setStandards(newStandards);
      console.log('useStandards.saveStandards: 保存成功', newStandards);
    } catch (error) {
      console.error('useStandards.saveStandards: 保存失败', error);
    }
  };

  const addStandard = (standard: Omit<EvaluationSystem, 'id' | 'createdAt'>) => {
    const newId = Math.random().toString(36).slice(2);
    console.log("useStandards.addStandard: 生成新标准ID:", newId);
    const newStandard: EvaluationSystem = {
      ...standard,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    const newStandards = [newStandard, ...standards];
    saveStandards(newStandards);
    console.log('useStandards.addStandard: 新增标准', newStandard);
    return newStandard.id;
  };

  const updateStandard = (updatedStandard: EvaluationSystem) => {
    const newStandards = standards.map(s =>
      s.id === updatedStandard.id ? updatedStandard : s
    );
    saveStandards(newStandards);
    console.log('useStandards.updateStandard: 更新标准', updatedStandard);
  };

  const deleteStandard = (id: string) => {
    const newStandards = standards.filter(s => s.id !== id);
    saveStandards(newStandards);
    console.log('useStandards.deleteStandard: 删除标准', id);
  };

  const getStandard = (id: string) => {
    return standards.find(s => s.id === id);
  };

  return {
    standards,
    addStandard,
    updateStandard,
    deleteStandard,
    getStandard,
  };
};
