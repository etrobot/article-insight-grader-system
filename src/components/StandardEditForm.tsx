import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { EvaluationSystem, Criterion } from '@/hooks/useStandards';

interface StandardEditFormProps {
  value: EvaluationSystem;
  onChange: (v: EvaluationSystem) => void;
}

export const StandardEditForm: React.FC<StandardEditFormProps> = ({ value, onChange }) => {
  // 顶层 name/description
  const handleFieldChange = (field: keyof EvaluationSystem, v: string) => {
    onChange({ ...value, [field]: v });
  };
  // criteria name/description
  const handleCriterionChange = (idx: number, field: keyof Criterion, v: any) => {
    const newCriteria = [...value.criteria];
    newCriteria[idx] = { ...newCriteria[idx], [field]: v };
    onChange({ ...value, criteria: newCriteria });
  };
  // criteria.description（对象/字符串）
  const handleCriterionDescChange = (idx: number, score: string, desc: string) => {
    const newCriteria = [...value.criteria];
    const criterion = { ...newCriteria[idx] };
    
    // Initialize description as an object with all required keys if it's not already
    if (typeof criterion.description !== 'object' || criterion.description === null) {
      criterion.description = {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": ""
      };
    }
    
    // Update the specific score's description
    criterion.description = { 
      ...criterion.description, 
      [score]: desc 
    };
    
    newCriteria[idx] = criterion;
    onChange({ ...value, criteria: newCriteria });
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="std-name">标准名称</Label>
        <Input
          id="std-name"
          value={value.name}
          onChange={e => handleFieldChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="std-desc">标准描述</Label>
        <Textarea
          id="std-desc"
          value={value.description || ''}
          onChange={e => handleFieldChange('description', e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <h4 className="text-md font-semibold">评估点</h4>
        {Array.isArray(value.criteria) && value.criteria.map((criterion, idx) => (
          <div key={criterion.id || idx} className="border rounded p-4 mb-2 bg-card/30">
            <div className="space-y-2">
              <Label>评估点名称</Label>
              <Input
                value={criterion.name}
                onChange={e => handleCriterionChange(idx, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>评估点描述</Label>
              {typeof criterion.description === 'object' && criterion.description !== null ? (
                <div className="space-y-1">
                  {Object.entries(criterion.description).map(([score, desc]) => (
                    <div key={score} className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground w-8">{score}分</span>
                      <Input
                        value={typeof desc === 'string' ? desc : ''}
                        onChange={e => handleCriterionDescChange(idx, score, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Textarea
                  value={typeof criterion.description === 'string' ? criterion.description : ''}
                  onChange={e => handleCriterionChange(idx, 'description', e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
