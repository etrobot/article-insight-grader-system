import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ArticleContentInputProps {
  articleContent1: string;
  articleContent2: string;
  onContentChange1: (content: string) => void;
  onContentChange2: (content: string) => void;
  isEvaluating: boolean;
}

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export const ArticleContentInput = ({
  articleContent1,
  articleContent2,
  onContentChange1,
  onContentChange2,
  isEvaluating
}: ArticleContentInputProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState('1');
  return (
    <div className="space-y-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="1">待评内容1</TabsTrigger>
          <TabsTrigger value="2">待评内容2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <div className="flex items-center justify-between">
            <Label htmlFor="article-content-1" className="text-base font-medium">待评内容1</Label>
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
            id="article-content-1"
            placeholder="请粘贴要评估的待评内容1..."
            value={articleContent1}
            onChange={(e) => onContentChange1(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isEvaluating}
          />
        </TabsContent>
        <TabsContent value="2">
          <div className="flex items-center justify-between">
            <Label htmlFor="article-content-2" className="text-base font-medium">待评内容2</Label>
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
            id="article-content-2"
            placeholder="请粘贴要评估的待评内容2..."
            value={articleContent2}
            onChange={(e) => onContentChange2(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isEvaluating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
