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
    'app.title': 'AI评估标准生成系统',
    'app.subtitle': '智能生成定制化的内容评估体系',
    'header.evaluate': '开始评估',
    'header.apiSettings': 'API设置',
    'header.apiConfig': 'API配置',
    'header.language': '语言',
    'header.theme': '主题',
    'header.lightMode': '浅色模式',
    'header.darkMode': '深色模式',
    
    // Tabs
    'tabs.builder': '标准构建',
    'tabs.standards': '标准列表',
    'tabs.evaluations': '评估记录',
    
    // API Settings
    'api.title': 'OpenAI兼容API配置',
    'api.description': '配置与OpenAI API兼容的服务端点，用于智能评估标准生成',
    'api.baseUrl': 'API Base URL',
    'api.baseUrlPlaceholder': 'https://api.openai.com',
    'api.baseUrlHelp': '支持OpenAI官方API或兼容格式的第三方API服务',
    'api.apiKey': 'API Key',
    'api.apiKeyPlaceholder': 'sk-...',
    'api.apiKeyHelp': '您的API密钥将仅在本地存储，不会上传到服务器',
    'api.model': 'Model',
    'api.modelPlaceholder': 'gpt-3.5-turbo',
    'api.modelHelp': '用于智能功能的AI模型名称 (例如: gpt-3.5-turbo, claude-3-opus-20240229)',
    'api.testConnection': '测试连接',
    'api.testing': '测试中...',
    'api.saveConfig': '保存配置',
    'api.connectionSuccess': 'API连接正常，可以使用智能功能',
    'api.connectionFailed': 'API连接失败，请检查配置',
    'api.configIncomplete': '配置不完整',
    'api.configIncompleteDesc': '请填写完整的API地址和密钥',
    'api.connectionSuccessTitle': '连接成功',
    'api.connectionSuccessDesc': 'API连接测试通过',
    'api.connectionFailedTitle': '连接失败',
    'api.connectionErrorTitle': '连接错误',
    'api.connectionErrorDesc': '无法连接到API服务器',
    'api.settingsSaved': '设置已保存',
    'api.settingsSavedDesc': 'API配置已更新',
    
    // Other common translations
    'common.close': '关闭',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.chinese': '中文',
    'common.english': 'English'
  },
  en: {
    // Header
    'app.title': 'Quality Assessment Standard Generator',
    'app.subtitle': 'Intelligently generate customized content evaluation systems',
    'header.evaluate': 'Evaluate',
    'header.apiSettings': 'API Settings',
    'header.apiConfig': 'API Configuration',
    'header.language': 'Language',
    'header.theme': 'Theme',
    'header.lightMode': 'Light Mode',
    'header.darkMode': 'Dark Mode',
    
    // Tabs
    'tabs.builder': 'Standard Builder',
    'tabs.standards': 'Standards List',
    'tabs.evaluations': 'Evaluation Records',
    
    // API Settings
    'api.title': 'OpenAI Compatible API Configuration',
    'api.description': 'Configure OpenAI API compatible service endpoints for intelligent evaluation standard generation',
    'api.baseUrl': 'API Base URL',
    'api.baseUrlPlaceholder': 'https://api.openai.com',
    'api.baseUrlHelp': 'Supports OpenAI official API or compatible third-party API services',
    'api.apiKey': 'API Key',
    'api.apiKeyPlaceholder': 'sk-...',
    'api.apiKeyHelp': 'Your API key will only be stored locally and will not be uploaded to the server',
    'api.model': 'Model',
    'api.modelPlaceholder': 'gpt-3.5-turbo',
    'api.modelHelp': 'AI model name for intelligent features (e.g.: gpt-3.5-turbo, claude-3-opus-20240229)',
    'api.testConnection': 'Test Connection',
    'api.testing': 'Testing...',
    'api.saveConfig': 'Save Configuration',
    'api.connectionSuccess': 'API connection is normal, intelligent features can be used',
    'api.connectionFailed': 'API connection failed, please check configuration',
    'api.configIncomplete': 'Configuration Incomplete',
    'api.configIncompleteDesc': 'Please fill in complete API address and key',
    'api.connectionSuccessTitle': 'Connection Successful',
    'api.connectionSuccessDesc': 'API connection test passed',
    'api.connectionFailedTitle': 'Connection Failed',
    'api.connectionErrorTitle': 'Connection Error',
    'api.connectionErrorDesc': 'Unable to connect to API server',
    'api.settingsSaved': 'Settings Saved',
    'api.settingsSavedDesc': 'API configuration updated',

    // Other common translations
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.chinese': 'Chinese',
    'common.english': 'English'
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
