import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    // Header
    'app.title': '文章质量评估标准生成器',
    'app.subtitle': '智能生成定制化的内容评估体系',
    'header.evaluate': '评估文章',
    'header.apiSettings': 'API设置',
    'header.apiConfig': 'API配置',
    
    // Tabs
    'tabs.builder': '标准构建',
    'tabs.standards': '标准列表',
    'tabs.evaluations': '评估记录',
    
    // Other common translations
    'common.close': '关闭',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认'
  },
  en: {
    // Header
    'app.title': 'Article Quality Assessment Standard Generator',
    'app.subtitle': 'Intelligently generate customized content evaluation systems',
    'header.evaluate': 'Evaluate Article',
    'header.apiSettings': 'API Settings',
    'header.apiConfig': 'API Configuration',
    
    // Tabs
    'tabs.builder': 'Standard Builder',
    'tabs.standards': 'Standards List',
    'tabs.evaluations': 'Evaluation Records',
    
    // Other common translations
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage || 'zh';
    }
    return 'zh';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
