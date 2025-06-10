
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  return (
    <div className="space-y-3">
      <Label htmlFor="article-content" className="text-base font-medium">内容内容</Label>
      <Textarea
        id="article-content"
        placeholder="请粘贴要评估的内容内容..."
        value={articleContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[200px] resize-none"
        disabled={isEvaluating}
      />
    </div>
  );
};
