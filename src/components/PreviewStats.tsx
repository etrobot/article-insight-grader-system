
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Settings2, CheckCircle2, Clock } from 'lucide-react';

interface PreviewStatsProps {
  categoriesCount: number;
  criteriaCount: number;
  totalWeight: number;
  version: string;
}

export const PreviewStats = ({ categoriesCount, criteriaCount, totalWeight, version }: PreviewStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-foreground font-medium">{categoriesCount}</p>
              <p className="text-muted-foreground text-sm">评估类别</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-foreground font-medium">{criteriaCount}</p>
              <p className="text-muted-foreground text-sm">评估标准</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-foreground font-medium">{totalWeight}</p>
              <p className="text-muted-foreground text-sm">总权重</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-foreground font-medium">v{version}</p>
              <p className="text-muted-foreground text-sm">版本号</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
