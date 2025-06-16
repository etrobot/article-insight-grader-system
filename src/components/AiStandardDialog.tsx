import { useState } from 'react';
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
  };
  onStandardGenerated: (standardData: EvaluationSystem) => void;
}

export const AiStandardDialog = ({ apiConfig, onStandardGenerated }: AiStandardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { generateStandard, isGenerating } = useAiStandardGeneration(apiConfig);

  const handleGenerate = async (systemName: string, systemDescription: string) => {
    const standard = await generateStandard(systemName, systemDescription);
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
        <AiStandardForm onGenerate={handleGenerate} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>
  );
};
