import { Standard } from '@/hooks/useStandards';

export interface EvaluationQueueItemData {
  id: string;
  standard: Standard;
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
  standard?: Standard;
  article_content?: string;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
  standard?: Standard;
}