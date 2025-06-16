import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle2 } from 'lucide-react';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { EvaluationSystem } from '@/hooks/useStandards';

interface StandardSelectorProps {
  standards: EvaluationSystem[];
  selectedStandardIds: string[];
  onStandardToggle: (standardId: string) => void;
  isEvaluating: boolean;
}

export interface StandardSelectorRef {
  getWeights: () => { [id: string]: number };
}

// localStorage key前缀
const LS_KEY_PREFIX = 'std_w8s_';

// 生成标准组合key，保证顺序一致
function getStandardKey(ids: string[]) {
  return LS_KEY_PREFIX + ids.slice().sort().join('_');
}

// 从localStorage读取权重
function loadWeightsFromStorage(ids: string[]): { [id: string]: number } | null {
  const key = getStandardKey(ids);
  const str = localStorage.getItem(key);
  if (str) {
    try {
      const obj = JSON.parse(str);
      console.log('[StandardSelector] 从localStorage读取权重', key, obj);
      return obj;
    } catch (e) {
      console.log('[StandardSelector] 解析localStorage权重失败', key, str);
    }
  }
  return null;
}


export const StandardSelector = forwardRef<StandardSelectorRef, StandardSelectorProps>(
  ({
    standards,
    selectedStandardIds,
    onStandardToggle,
    isEvaluating
  }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 权重本地 state，key 为标准 id，value 为权重
    const [standardWeights, setStandardWeights] = useState<{ [id: string]: number }>({});

    // 初始化权重，已选标准没有权重时默认 1/已选标准数
    useEffect(() => {
      // 只处理已选标准
      const selected = standards.filter(s => selectedStandardIds.includes(s.id));
      const defaultWeight = selected.length > 0 ? 1 / selected.length : 1;
      let newWeights: { [id: string]: number } = {};
      // 优先从localStorage加载
      const storageWeights = loadWeightsFromStorage(selectedStandardIds);
      if (storageWeights) {
        newWeights = { ...storageWeights };
        console.log('[StandardSelector] useEffect: 使用localStorage权重', newWeights);
      } else {
        // 没有存储则用默认
        selected.forEach(s => {
          newWeights[s.id] = s.weight_in_parent !== undefined ? s.weight_in_parent : defaultWeight;
        });
        console.log('[StandardSelector] useEffect: 使用默认权重', newWeights);
      }
      setStandardWeights(newWeights);
    }, [selectedStandardIds, standards]);

    // 权重输入变化
    const handleWeightChange = (id: string, value: string) => {
      let num = parseFloat(value);
      if (isNaN(num) || num < 0) num = 0;
      setStandardWeights(prev => {
        const updated = { ...prev, [id]: num };
        console.log('[StandardSelector] handleWeightChange', id, value, updated);
        return updated;
      });
    };

    // 暴露 getWeights 方法
    useImperativeHandle(ref, () => ({
      getWeights: () => ({ ...standardWeights })
    }), [standardWeights]);

    if (standards.length === 0) {
      return (
        <div className="space-y-3">
          <Label className="text-base font-medium">选择评估标准（可多选）</Label>
          <Card className="border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p>暂无评估标准</p>
                <p className="text-sm">请先在"标准构建"页面创建评估标准</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-base font-medium">选择评估标准</Label>
          <button
            type="button"
            className="px-2 py-0.5 text-xs border rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
            disabled={isEvaluating || standards.length === selectedStandardIds.length}
            onClick={e => {
              e.stopPropagation();
              if (isEvaluating) return;
              const toSelect = standards.filter(s => !selectedStandardIds.includes(s.id)).map(s => s.id);
              toSelect.forEach(id => onStandardToggle(id));
            }}
          >全选</button>
          <button
            type="button"
            className="px-2 py-0.5 text-xs border rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
            disabled={isEvaluating || selectedStandardIds.length === 0}
            onClick={e => {
              e.stopPropagation();
              if (isEvaluating) return;
              console.log('[StandardSelector] 反选按钮点击, 待取消id:', selectedStandardIds);
              selectedStandardIds.forEach(id => onStandardToggle(id));
              console.log('[StandardSelector] 反选后已选id:', []);
            }}
          >反选</button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {standards.map((standard) => (
            <div key={standard.id} className="cursor-pointer" onClick={() => !isEvaluating && onStandardToggle(standard.id)}>
              <Card className={`border transition-colors ${
                selectedStandardIds.includes(standard.id)
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-border hover:bg-secondary/50'
              } ${isEvaluating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    {selectedStandardIds.includes(standard.id) && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{standard.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {standard.description}
                  </CardDescription>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(standard.createdAt)}</span>
                  </div>
                  {/* 权重输入框，仅在被选中时显示 */}
                  {selectedStandardIds.includes(standard.id) && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-foreground">权重：</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={standardWeights[standard.id] ?? ''}
                        onChange={e => handleWeightChange(standard.id, e.target.value)}
                        className="w-16 px-1 py-0.5 border rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={e => e.stopPropagation()}
                        disabled={isEvaluating}
                      />
                    </div>
                  )}
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
