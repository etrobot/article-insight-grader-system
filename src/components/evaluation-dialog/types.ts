import { EvaluationSystem } from '@/hooks/useStandards';

export interface EvaluationQueueItemData {
  id: string;
  standard: EvaluationSystem;
  status: 'queued' | 'evaluating' | 'completed' | 'failed' | 'partial';
  progress?: number;
  error?: string;
  result?: EvaluationResult;
}

export interface EvaluationResult {
  id: string;
  article_title: string;
  total_score: number;
  evaluation_date: string;
  criteria: EvaluationCriterion[];
  summary: string;
  standard?: EvaluationSystem;
  article_content?: string;
  group_key?: string;
  weight_in_parent?: number;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
  standard?: EvaluationSystem;
}