
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Trash2,
  Eye,
  Calendar,
  Settings2,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Standard } from '@/hooks/useStandards';

interface StandardsListProps {
  standards: Standard[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onUpdate?: (updatedStandard: Standard) => void;
}

export const StandardsList = ({ standards, onDelete, onView, onUpdate }: StandardsListProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "删除成功",
      description: `评估标准"${name}"已删除`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 复制全部标准到剪贴板
  const handleCopyAll = () => {
    const mergedArray = standards.map(s => ({ ...s }));
    console.log('[复制全部标准] 合并后的数组:', mergedArray);
    const jsonStr = JSON.stringify(mergedArray, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      console.log('[复制全部标准] 复制成功');
      toast({
        title: '复制成功',
        description: `已将${standards.length}个标准合并为数组并复制到剪贴板`,
      });
    }).catch((err) => {
      console.log('[复制全部标准] 复制失败', err);
      toast({
        title: '复制失败',
        description: '请检查浏览器权限或控制台日志',
        variant: 'destructive',
      });
    });
  };

  if (standards.length === 0) {
    return (
      <Card className="bg-card backdrop-blur-sm border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-secondary rounded-full">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-foreground text-lg font-medium">暂无评估标准</h3>
            <p className="text-muted-foreground text-sm mt-2">
              请先在"标准构建"页面生成评估标准
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">评估标准列表</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            共 {standards.length} 个标准
          </Badge>
          <Button
            onClick={handleCopyAll}
            size="sm"
            variant="outline"
            className="border-blue-400 text-blue-500 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-1" />
            复制全部
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {standards.map((standard) => (
          <Card key={standard.id} className="bg-card backdrop-blur-sm border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-foreground text-lg flex items-center space-x-2">
                    <Settings2 className="w-5 h-5 text-blue-400" />
                    <span>{standard.name}</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {standard.description}
                  </CardDescription>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(standard.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    onClick={() => onView(standard.id)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  <Button
                    onClick={() => handleDelete(standard.id, standard.name)}
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
