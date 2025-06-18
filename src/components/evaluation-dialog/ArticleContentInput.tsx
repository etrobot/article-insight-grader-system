import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ArticleContentInputProps {
  articleContent: string;
  onContentChange: (content: string) => void;
  isEvaluating: boolean;
}

export const ArticleContentInput = ({
  articleContent,
  onContentChange,
  isEvaluating
}: ArticleContentInputProps) => {
  const { toast } = useToast();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="article-content" className="text-base font-medium">待评内容</Label>
        <button
          className="px-2 py-0.5 text-xs border rounded"
          onClick={() => {
            toast({
              title: "功能开发中",
              description: "敬请期待",
            });
          }}
        >
          上传文档(pdf/word)
        </button>
      </div>
      <Textarea
        id="article-content"
        placeholder="请粘贴要评估的待评内容..."
        value={articleContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[420px] resize-none"
        disabled={isEvaluating}
      />
    </div>
  );
};
