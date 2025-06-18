import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { AiStandardForm } from '@/components/AiStandardForm';
import { useAiStandardGeneration } from '@/hooks/useAiStandardGeneration';
import { EvaluationSystem } from '@/hooks/useStandards';

interface AiStandardDialogProps {
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
    model2?: string;
  };
  onStandardGenerated: (standardData: EvaluationSystem) => void;
}

export const AiStandardDialog = ({ apiConfig, onStandardGenerated }: AiStandardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(apiConfig.model);

  useEffect(() => {
    const saved = localStorage.getItem('ai_std_model');
    if (saved && (saved === apiConfig.model || saved === apiConfig.model2)) {
      setSelectedModel(saved);
    } else {
      setSelectedModel(apiConfig.model);
    }
  }, [apiConfig.model, apiConfig.model2]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    localStorage.setItem('ai_std_model', e.target.value);
    console.log('[AiStandardDialog] 选择模型:', e.target.value);
  };

  const { generateStandard: _generateStandard, isGenerating } = useAiStandardGeneration({
    ...apiConfig,
    model: selectedModel
  });

  const handleGenerate = async (systemName: string, systemDescription: string) => {
    console.log('[AiStandardDialog] handleGenerate 入参:', { systemName, systemDescription, model: selectedModel });
    const standard = await _generateStandard(systemName, systemDescription);
    console.log('[AiStandardDialog] generateStandard 返回:', standard);
    if (standard) {
      onStandardGenerated(standard);
      console.log('[AiStandardDialog] onStandardGenerated 入参:', standard);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-theme-pink to-theme-orange hover:from-pink-600 hover:to-orange-600 text-white">
          <Wand2 className="w-4 h-4 mr-2" />
          添加标准
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AI生成评估标准</DialogTitle>
        </DialogHeader>
        <div className="mb-2">
          <select value={selectedModel} onChange={handleModelChange} className="w-full border rounded px-2 py-1 bg-background text-foreground">
            <option value={apiConfig.model}>{apiConfig.model}</option>
            {apiConfig.model2 && <option value={apiConfig.model2}>{apiConfig.model2}</option>}
          </select>
        </div>
        <AiStandardForm onGenerate={handleGenerate} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>
  );
};
