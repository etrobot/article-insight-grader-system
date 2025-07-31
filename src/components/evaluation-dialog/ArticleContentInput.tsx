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
import { useState, useRef } from 'react';
import { Loader2, FileText } from 'lucide-react';

export const ArticleContentInput = ({
  articleContent1,
  articleContent2,
  onContentChange1,
  onContentChange2,
  isEvaluating
}: ArticleContentInputProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState('1');
  const [isParsing, setIsParsing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string>("");
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  
  const simulateDocParsing = async (files: FileList, isFirstTab: boolean) => {
    if (files.length === 0) return;
    
    setIsParsing(true);
    const updateContent = isFirstTab ? onContentChange1 : onContentChange2;
    let currentContent = isFirstTab ? articleContent1 : articleContent2;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);
        // 模拟每个文件的解析过程
        for (let j = 1; j <= 3; j++) {
          await new Promise(resolve => setTimeout(resolve, 800));
          const newPart = `\n\n---------- ${file.name} ----------\n\n模拟解析文本${j}`;
          currentContent = currentContent + (currentContent ? '\n\n' : '') + newPart;
          updateContent(currentContent);
        }
      }
      toast({
        title: "解析完成",
        description: `成功解析 ${files.length} 个文件`,
      });
    } catch (error) {
      toast({
        title: "解析失败",
        description: "文件解析过程中出现错误",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };
  return (
    <div className="space-y-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="1">待评内容</TabsTrigger>
          {/* <TabsTrigger value="2">待评内容2</TabsTrigger> */}
        </TabsList>
        <TabsContent value="1">
          <div className="flex items-center justify-between">
            <div>
              <input
                type="file"
                ref={fileInputRef1}
                className="hidden"
                multiple
                onChange={(e) => e.target.files && simulateDocParsing(e.target.files, true)}
                disabled={isParsing || isEvaluating}
              />
              <div className="flex">
                <button
                  className="px-2 py-0.5 text-xs border rounded hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => fileInputRef1.current?.click()}
                  disabled={isParsing || isEvaluating}
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>正在解析 {currentFile}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      <span>上传文档(pdf/word)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
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
            <div>
              <input
                type="file"
                ref={fileInputRef2}
                className="hidden"
                multiple
                onChange={(e) => e.target.files && simulateDocParsing(e.target.files, false)}
                disabled={isParsing || isEvaluating}
              />
              <div className="flex flex-col items-end gap-1">
                <button
                  className="px-2 py-0.5 text-xs border rounded hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => fileInputRef2.current?.click()}
                  disabled={isParsing || isEvaluating}
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>解析中...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      <span>上传文档(pdf/word)</span>
                    </>
                  )}
                </button>
                {isParsing && currentFile && (
                  <div className="text-xs text-muted-foreground animate-fade-in">
                    正在解析: {currentFile}
                  </div>
                )}
              </div>
            </div>
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
