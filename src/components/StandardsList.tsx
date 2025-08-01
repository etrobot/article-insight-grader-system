import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Trash2,
  Eye,
  Calendar,
  Settings2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EvaluationSystem } from '@/hooks/useStandards';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import React from 'react';

interface StandardsListProps {
  standards: EvaluationSystem[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onUpdate?: (updatedStandard: EvaluationSystem) => void;
}

export const StandardsList = ({ standards, onDelete, onView, onUpdate }: StandardsListProps) => {
  const { toast } = useToast();
  // 拖拽排序相关
  const LOCAL_KEY = 'standards_order';
  // 读取localStorage顺序
  const getOrderedStandards = () => {
    try {
      const orderStr = localStorage.getItem(LOCAL_KEY);
      if (orderStr) {
        const orderArr = JSON.parse(orderStr);
        console.log('[标准排序] 读取localStorage顺序:', orderArr);
        // 按顺序重排
        const id2standard = Object.fromEntries(standards.map(s => [s.id, s]));
        const ordered = orderArr.map((id: string) => id2standard[id]).filter(Boolean);
        // 补充未在orderArr中的新标准
        const rest = standards.filter(s => !orderArr.includes(s.id));
        return [...ordered, ...rest];
      }
    } catch (e) {
      console.log('[标准排序] 读取localStorage顺序失败', e);
    }
    return standards;
  };
  const [orderedStandards, setOrderedStandards] = React.useState<EvaluationSystem[]>(getOrderedStandards());

  // 标准变动时同步顺序
  React.useEffect(() => {
    setOrderedStandards(getOrderedStandards());
  }, [standards]);

  // 拖拽结束处理
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const newOrder = Array.from(orderedStandards);
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setOrderedStandards(newOrder);
    // 保存顺序到localStorage
    const idOrder = newOrder.map(s => s.id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(idOrder));
    console.log('[标准排序] 拖拽后新顺序:', idOrder);
    toast({ description: <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />排序已保存</div> });
  };

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
    const mergedArray = orderedStandards.map(s => ({ ...s }));
    console.log('[复制全部标准] 合并后的数组:', mergedArray);
    const jsonStr = JSON.stringify(mergedArray, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      console.log('[复制全部标准] 复制成功');
      toast({
        title: '复制成功',
        description: `已将${orderedStandards.length}个标准合并为数组并复制到剪贴板`,
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

  if (orderedStandards.length === 0) {
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
        <h2 className="text-foreground text-2xl font-bold">评估标准管理</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            共 {orderedStandards.length} 个标准
          </Badge>
          {/* <Button
            onClick={handleCopyAll}
            size="sm"
            variant="outline"
            className="border-blue-400 text-blue-500 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-1" />
            复制全部
          </Button> */}
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="standards-list">
          {(provided) => (
            <div
              className="space-y-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {orderedStandards.map((standard, idx) => (
                <Draggable key={standard.id} draggableId={standard.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-shadow ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                    >
                      <Card className="bg-card backdrop-blur-sm border-border hover:shadow-md">
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
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
