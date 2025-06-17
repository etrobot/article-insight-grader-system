
import { useToast } from '@/hooks/use-toast';

interface ValidationConfig {
  selectedStandardIds: string[];
  articleContent: string;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
}

export const useEvaluationValidation = () => {
  const { toast } = useToast();

  const validateInputs = ({ selectedStandardIds, articleContent, apiConfig }: ValidationConfig) => {
    if (selectedStandardIds.length === 0) {
      toast({
        title: "请选择评估标准",
        description: "请至少选择一个评估标准",
        variant: "destructive",
      });
      return false;
    }

    if (!articleContent.trim()) {
      toast({
        title: "请输入待评内容",
        description: "请输入要评估的待评内容",
        variant: "destructive",
      });
      return false;
    }

    if (!apiConfig.baseUrl || !apiConfig.apiKey || !apiConfig.model) {
      toast({
        title: "请配置API设置",
        description: "请先在API设置中配置完整的API信息",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateInputs };
};
