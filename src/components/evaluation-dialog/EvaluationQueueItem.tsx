import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { EvaluationSystem } from '@/hooks/useStandards'
import { EvaluationResult } from './types';

export type EvaluationStatus = 'queued' | 'evaluating' | 'completed' | 'failed' | 'partial';

export interface EvaluationQueueItemData {
  id: string;
  standard: EvaluationSystem;
  status: EvaluationStatus;
  progress?: number;
  result?: EvaluationResult;
  error?: string;
}

interface EvaluationQueueItemProps {
  item: EvaluationQueueItemData;
  index: number;
}

export const EvaluationQueueItem = ({ item, index }: EvaluationQueueItemProps) => {
  console.log(`渲染队列项 ${index}:`, item);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'evaluating':
        return <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'queued':
        return <Badge variant="secondary">排队中</Badge>;
      case 'evaluating':
        return <Badge variant="default" className="bg-blue-500">评估中</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">已完成</Badge>;
      case 'failed':
        return <Badge variant="destructive">失败</Badge>;
      case 'partial':
        return <Badge variant="default" className="bg-yellow-500">部分完成</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getScoreDisplay = () => {
    if (item.result && item.result.total_score !== undefined) {
      return (
        <div className="text-lg font-semibold text-green-600">
          {item.result.total_score}分
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`transition-all duration-200 ${
      item.status === 'evaluating' ? 'border-blue-300 bg-blue-50' :
      item.status === 'completed' ? 'border-green-300 bg-green-50' :
      item.status === 'failed' ? 'border-red-300 bg-red-50' :
      'border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
              {index + 1}
            </div>
            {getStatusIcon()}
            <div className="flex-1">
              <div className="flex items-center space-x-2 justify-between">
                <h4 className="font-medium truncate">
                  {item.standard.name}
                </h4>
                <div className="flex items-center space-x-3">
                  {getScoreDisplay()}
                  {getStatusBadge()}
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {item.standard.description}
              </p>
            </div>
          </div>
        </div>


        {/* 错误信息 */}
        {item.status === 'failed' && item.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            错误: {item.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
