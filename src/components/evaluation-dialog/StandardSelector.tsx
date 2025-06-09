
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Standard } from '@/hooks/useStandards';

interface StandardSelectorProps {
  standards: Standard[];
  selectedStandardIds: string[];
  onStandardToggle: (standardId: string) => void;
  isEvaluating: boolean;
}

export const StandardSelector = ({
  standards,
  selectedStandardIds,
  onStandardToggle,
  isEvaluating
}: StandardSelectorProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <Label className="text-base font-medium">选择评估标准（可多选）</Label>
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
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
