import { EvaluationSystem } from '@/hooks/useStandards';

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface EvaluationCriterion {
  id: string;
  name: string;
  score: number;
  max_score: number;
  comment: string;
}

interface EvaluationResult {
  article_title: string;
  total_score: number;
  evaluation_date: string;
  criteria: EvaluationCriterion[];
  summary: string;
  standard?: EvaluationSystem;
  id: string;
  article_content?: string;
  weight_in_parent: number;
  group_key?: string;
}

export const evaluateSingleStandard = async (
  standard: EvaluationSystem,
  articleContent: string,
  apiConfig: ApiConfig,
  groupKey?: string
) => {
  const evaluationPrompt = `请根据以下评估标准对内容进行详细评估：

评估标准：
${JSON.stringify(standard, null, 2)}

待评内容：
${articleContent}

请按照评估标准的结构，对内容进行逐项打分和评价，并给出总分和详细的评估报告。返回JSON格式的评估结果，包含：
- 各标准的得分和评价（请参考标准中的1-5分详细描述进行评分）
- 总分
- 综合评价（一段话）

请严格按照以下JSON结构返回：
{
  "article_title": "内容标题（从内容中提取或生成）",
  "total_score": 总分数字,
  "evaluation_date": "${new Date().toISOString()}",
  "criteria": [
    {
      "id": "标准ID",
      "name": "标准名称",
      "score": 得分（没有找到相关信息为0）,
      "max_score": 5,
      "comment": "简洁评价（请说明为什么给出这个分数，参考标准中的1-5分描述），若未找到请返回'内容未提及'"
      "cite":["引用段落1开头+省略号......+引用段落1结尾","引用段落2开头+省略......+引用段落2结尾","引用段落N开头+省略......+引用段落N结尾"]
    }
  ],
  "summary": "用分析师的口吻总结被评对象在这个标准下的表现"
}`;

  const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
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

  const evaluationResult = JSON.parse(jsonMatch[0]) as EvaluationResult;

  // 计算总分
  console.log("evaluationApi: 开始计算总分");
  console.log("evaluationApi: 评估结果原始数据:", evaluationResult);
  console.log("evaluationApi: 标准数据:", standard);

  let totalScore = 0;
  let totalWeight = 0;

  evaluationResult.criteria.forEach((criterion: EvaluationCriterion) => {
    const standardCriterion = standard.criteria.find(c => c.id === criterion.id);
    if (standardCriterion) {
      console.log(`evaluationApi: 计算标准 ${criterion.name} 的得分`);
      console.log(`evaluationApi: 原始得分: ${criterion.score}, 权重: ${standardCriterion.weight}`);

      // 将1-5分转换为百分比
      const scorePercentage = (criterion.score / criterion.max_score) * 100;
      const weightedScore = (scorePercentage * standardCriterion.weight) / 100;

      console.log(`evaluationApi: 得分百分比: ${scorePercentage}%, 加权得分: ${weightedScore}`);

      totalScore += weightedScore;
      totalWeight += standardCriterion.weight;
    }
  });

  // 确保所有权重都被计算
  if (totalWeight !== standard.total_weight) {
    console.warn(`evaluationApi: 权重总和(${totalWeight})与标准总权重(${standard.total_weight})不匹配`);
  }

  // 更新总分
  evaluationResult.total_score = Math.round(totalScore);
  console.log("evaluationApi: 最终总分:", evaluationResult.total_score);

  evaluationResult.standard = standard;
  evaluationResult.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  evaluationResult.article_content = articleContent;
  evaluationResult.weight_in_parent = standard.weight_in_parent || 0;
  if (groupKey) evaluationResult.group_key = groupKey;
  return evaluationResult;
};
