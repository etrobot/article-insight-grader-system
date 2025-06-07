
import { useState, useEffect } from 'react';

export interface Standard {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  evaluation_system: any;
}

export const useStandards = () => {
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = () => {
    try {
      const saved = localStorage.getItem('evaluationStandards');
      if (saved) {
        const parsedStandards = JSON.parse(saved);
        setStandards(parsedStandards);
      }
    } catch (error) {
      console.error('Failed to load standards from localStorage:', error);
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
    deleteStandard,
    getStandard,
  };
};
