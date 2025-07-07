import { createContext, useContext } from 'react';
import { useArticleEvaluations } from '@/hooks/useArticleEvaluations';

interface ArticleEvaluationsContextType {
  getArticleGroups: () => any[]; // 这里可以定义更具体的返回类型
}

export const ArticleEvaluationsContext = createContext<ArticleEvaluationsContextType>({
  getArticleGroups: () => []
});

export const useArticleEvaluationsContext = () => useContext(ArticleEvaluationsContext);

export const ArticleEvaluationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { getArticleGroups } = useArticleEvaluations();

  return (
    <ArticleEvaluationsContext.Provider value={{ getArticleGroups }}>
      {children}
    </ArticleEvaluationsContext.Provider>
  );
};
