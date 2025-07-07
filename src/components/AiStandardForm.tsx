
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';

interface AiStandardFormProps {
  onGenerate: (name: string, description: string) => void;
  isGenerating: boolean;
}

const STORAGE_KEY = 'ai_standard_form_data';

export const AiStandardForm = ({ onGenerate, isGenerating }: AiStandardFormProps) => {
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');

  // 加载保存的表单数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { name, description } = JSON.parse(savedData);
        setSystemName(name || '');
        setSystemDescription(description || '');
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
  }, []);

  // 保存表单数据到本地存储
  const saveFormData = (name: string, description: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, description }));
  };

  const handleSubmit = () => {
    if (systemName.trim() && systemDescription.trim()) {
      onGenerate(systemName, systemDescription);
      // 提交后清空本地存储
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // 输入变化时保存到本地存储
  const handleNameChange = (value: string) => {
    setSystemName(value);
    saveFormData(value, systemDescription);
  };

  const handleDescriptionChange = (value: string) => {
    setSystemDescription(value);
    saveFormData(systemName, value);
  };

  const isValid = systemName.trim() && systemDescription.trim();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">标准名称</Label>
        <Input
          id="name"
          value={systemName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="如：AI内容质量评估系统"
          className="border-gray-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700">标准描述</Label>
        <Textarea
          id="description"
          value={systemDescription}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="描述评估系统的用途和特点..."
          className="border-gray-300"
          rows={3}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !isValid}
        className="w-full text-white bg-gradient-to-r from-theme-yellow to-theme-orange hover:from-yellow-600 hover:to-orange-600"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            AI生成中...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            生成评估标准
          </>
        )}
      </Button>
    </div>
  );
};
