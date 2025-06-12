
import { useState, useEffect } from 'react';
import { DEFAULT_STANDARDS } from '@/lib/standards';

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  score_range?: [number, number];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  weight: number;
  description?: string;
  criteria: Criterion[];
}

export interface EvaluationSystem {
  name: string;
  description?: string;
  version: string;
  total_weight: number;
  categories: Category[];
}

export interface Standard {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  evaluation_system: EvaluationSystem;
}

export const useStandards = () => {
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = () => {
    // 加载标准时详细打 log
    console.log("useStandards.loadStandards: 尝试从 localStorage 读取 evaluationStandards");
    const saved = localStorage.getItem('evaluationStandards');
    console.log("useStandards.loadStandards: localStorage 原始内容:", saved);
    if (saved === null) {
      // 只有 key 不存在时才初始化默认标准
      const arr = DEFAULT_STANDARDS.map(std => ({
        id: Date.now().toString() + Math.random().toString().slice(2, 8),
        name: std.name,
        description: std.description,
        createdAt: new Date().toISOString(),
        evaluation_system: std.evaluation_system, // Extract the actual evaluation system
      }));
      localStorage.setItem('evaluationStandards', JSON.stringify(arr));
      setStandards(arr);
      console.log("useStandards.loadStandards: 首次初始化全部标准，内容:", arr);
    } else {
      // key 存在（无论内容如何）都直接用
      const parsedStandards = JSON.parse(saved);
      console.log("useStandards.loadStandards: 解析后标准:", parsedStandards);
      setStandards(parsedStandards);
    }
  };

  const saveStandards = (newStandards: Standard[]) => {
    try {
      localStorage.setItem('evaluationStandards', JSON.stringify(newStandards));
      setStandards(newStandards);
    } catch (error) {
      console.error('Failed to save standards to localStorage:', error);
    }
  };

  const addStandard = (standard: Omit<Standard, 'id' | 'createdAt'>) => {
    const newStandard: Standard = {
      ...standard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newStandards = [newStandard, ...standards];
    saveStandards(newStandards);
    return newStandard.id;
  };

  const updateStandard = (updatedStandard: Standard) => {
    const newStandards = standards.map(s => 
      s.id === updatedStandard.id ? updatedStandard : s
    );
    saveStandards(newStandards);
  };

  const deleteStandard = (id: string) => {
    const newStandards = standards.filter(s => s.id !== id);
    saveStandards(newStandards);
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
