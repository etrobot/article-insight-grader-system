
import { Standard } from '@/hooks/useStandards';

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const evaluateSingleStandard = async (
  standard: Standard, 
  articleContent: string, 
  apiConfig: ApiConfig
) => {
  const evaluationPrompt = `请根据以下评估标准对文章进行详细评估：

评估标准：
${JSON.stringify(standard.evaluation_system, null, 2)}

文章内容：
${articleContent}

请按照评估标准的结构，对文章进行逐项打分和评价，并给出总分和详细的评估报告。返回JSON格式的评估结果，包含：
- 各类别的得分和评价
- 各标准的得分和评价  
- 总分
- 综合评价
- 改进建议

请严格按照以下JSON结构返回：
{
  "article_title": "文章标题（从内容中提取或生成）",
  "total_score": 总分数字,
  "evaluation_date": "${new Date().toISOString()}",
  "categories": [
    {
      "id": "类别ID",
      "name": "类别名称", 
      "score": 得分,
      "max_score": 满分,
      "comment": "评价说明",
      "criteria": [
        {
          "id": "标准ID",
          "name": "标准名称",
          "score": 得分,
          "max_score": 满分,
          "comment": "详细评价"
        }
      ]
    }
  ],
  "summary": "综合评价总结",
  "suggestions": ["改进建议1", "改进建议2"]
}`;

  const response = await fetch(`${apiConfig.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }

  const data = await response.json();
  const evaluationContent = data.choices?.[0]?.message?.content;

  if (!evaluationContent) {
    throw new Error('未收到有效的评估结果');
  }

  const jsonMatch = evaluationContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('评估结果格式不正确');
  }

  const evaluationResult = JSON.parse(jsonMatch[0]);
  evaluationResult.standard = standard;
  evaluationResult.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  evaluationResult.article_content = articleContent;

  return evaluationResult;
};
