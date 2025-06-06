
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Wand2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  weight: number;
  description: string;
  criteria: Criterion[];
}

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  scoreRange: [number, number];
}

interface EvaluationStandardBuilderProps {
  onStandardGenerated: (standard: any) => void;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
  };
}

export const EvaluationStandardBuilder = ({ onStandardGenerated, apiConfig }: EvaluationStandardBuilderProps) => {
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const addCategory = () => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: '',
      weight: 25,
      description: '',
      criteria: []
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const updateCategory = (categoryId: string, field: keyof Category, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  const addCriterion = (categoryId: string) => {
    const newCriterion: Criterion = {
      id: `crit-${Date.now()}`,
      name: '',
      description: '',
      weight: 1,
      scoreRange: [1, 5]
    };
    
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, criteria: [...cat.criteria, newCriterion] }
        : cat
    ));
  };

  const removeCriterion = (categoryId: string, criterionId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? { ...cat, criteria: cat.criteria.filter(crit => crit.id !== criterionId) }
        : cat
    ));
  };

  const updateCriterion = (categoryId: string, criterionId: string, field: keyof Criterion, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? {
            ...cat,
            criteria: cat.criteria.map(crit =>
              crit.id === criterionId ? { ...crit, [field]: value } : crit
            )
          }
        : cat
    ));
  };

  const generateStandard = () => {
    if (!systemName.trim() || categories.length === 0) {
      toast({
        title: "信息不完整",
        description: "请填写系统名称并添加至少一个评估类别",
        variant: "destructive"
      });
      return;
    }

    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    
    const evaluationSystem = {
      evaluation_system: {
        name: systemName,
        description: systemDescription,
        version: "1.0",
        total_weight: totalWeight,
        categories: categories.reduce((acc, cat) => {
          acc[cat.id] = {
            name: cat.name,
            weight: cat.weight,
            description: cat.description,
            criteria: cat.criteria.reduce((critAcc, crit) => {
              critAcc[crit.id] = {
                name: crit.name,
                description: crit.description,
                weight: crit.weight,
                score_range: crit.scoreRange
              };
              return critAcc;
            }, {} as any)
          };
          return acc;
        }, {} as any),
        scoring_algorithm: {
          description: "加权平均算法",
          formula: "总分 = Σ(类别权重 × 类别得分)",
          normalization: "最终得分归一化到0-100分"
        },
        generated_at: new Date().toISOString()
      }
    };

    onStandardGenerated(evaluationSystem);
    toast({
      title: "生成成功",
      description: "评估标准已生成，可在预览页面查看",
    });
  };

  const loadTemplate = () => {
    const template: Category[] = [
      {
        id: 'technical_quality',
        name: '技术质量评估',
        weight: 35,
        description: '评估技术方案的理论基础、实验设计和复现性',
        criteria: [
          {
            id: 'theoretical_foundation',
            name: '理论基础检验',
            description: '是否基于扎实的数学理论（信息论、概率论等）',
            weight: 12,
            scoreRange: [1, 5]
          },
          {
            id: 'experimental_rigor',
            name: '实验设计严谨性',
            description: '基准测试是否全面且具有挑战性',
            weight: 12,
            scoreRange: [1, 5]
          }
        ]
      },
      {
        id: 'innovation_impact',
        name: '创新性与影响力评估',
        weight: 25,
        description: '评估技术突破程度和通用性',
        criteria: [
          {
            id: 'breakthrough_level',
            name: '技术突破程度',
            description: '渐进式改进到范式转换的评估',
            weight: 10,
            scoreRange: [1, 5]
          }
        ]
      }
    ];
    
    setCategories(template);
    setSystemName('世界模型内容质量评估系统');
    setSystemDescription('基于AI和机器学习技术的智能内容质量评估框架');
    
    toast({
      title: "模板加载成功",
      description: "已加载默认评估标准模板",
    });
  };

  return (
    <div className="space-y-6">
      {/* 系统基本信息 */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>评估系统配置</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            设置评估系统的基本信息和参数
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemName" className="text-white">系统名称</Label>
              <Input
                id="systemName"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="如：AI内容质量评估系统"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">快速开始</Label>
              <Button
                onClick={loadTemplate}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                加载模板
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemDesc" className="text-white">系统描述</Label>
            <Textarea
              id="systemDesc"
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              placeholder="描述评估系统的用途和特点..."
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 评估类别配置 */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">评估类别</CardTitle>
            <CardDescription className="text-slate-300">
              配置评估的主要维度和权重分配
            </CardDescription>
          </div>
          <Button
            onClick={addCategory}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加类别
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border border-white/10 rounded-lg bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">类别名称</Label>
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      placeholder="如：技术质量"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">权重: {category.weight}%</Label>
                    <Slider
                      value={[category.weight]}
                      onValueChange={(value) => updateCategory(category.id, 'weight', value[0])}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => removeCategory(category.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white text-sm">类别描述</Label>
                <Textarea
                  value={category.description}
                  onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                  placeholder="描述这个评估类别的具体内容..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  rows={2}
                />
              </div>

              {/* 评估标准 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-sm">评估标准</Label>
                  <Button
                    onClick={() => addCriterion(category.id)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    添加标准
                  </Button>
                </div>
                
                {category.criteria.map((criterion) => (
                  <div key={criterion.id} className="p-3 border border-white/5 rounded bg-white/5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-white text-xs">标准名称</Label>
                        <Input
                          value={criterion.name}
                          onChange={(e) => updateCriterion(category.id, criterion.id, 'name', e.target.value)}
                          placeholder="评估标准"
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">权重: {criterion.weight}</Label>
                        <Slider
                          value={[criterion.weight]}
                          onValueChange={(value) => updateCriterion(category.id, criterion.id, 'weight', value[0])}
                          max={20}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">评分范围</Label>
                        <Select
                          value={`${criterion.scoreRange[0]}-${criterion.scoreRange[1]}`}
                          onValueChange={(value) => {
                            const [min, max] = value.split('-').map(Number);
                            updateCriterion(category.id, criterion.id, 'scoreRange', [min, max]);
                          }}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5分</SelectItem>
                            <SelectItem value="1-10">1-10分</SelectItem>
                            <SelectItem value="0-100">0-100分</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => removeCriterion(category.id, criterion.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">标准描述</Label>
                      <Input
                        value={criterion.description}
                        onChange={(e) => updateCriterion(category.id, criterion.id, 'description', e.target.value)}
                        placeholder="描述这个评估标准的具体要求..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={generateStandard}
          disabled={isGenerating || !systemName.trim() || categories.length === 0}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 text-lg"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isGenerating ? '生成中...' : '生成评估标准'}
        </Button>
      </div>
    </div>
  );
};
