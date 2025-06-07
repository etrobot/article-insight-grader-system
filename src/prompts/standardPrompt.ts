// AI内容质量评估标准生成提示词

export const standardPromptExampleJson = {
  "name": "AI内容质量评估系统",
  "description": "用于评估文章内容质量的多维度标准体系",
  "version": "1.0",
  "total_weight": 100,
  "categories": [
    {
      "id": "content_quality",
      "name": "内容质量",
      "weight": 40,
      "description": "评估文章的专业性、准确性和深度",
      "criteria": [
        {
          "id": "accuracy",
          "name": "准确性",
          "description": "内容事实准确，数据可靠",
          "weight": 15,
          "score_range": [1, 5]
        },
        {
          "id": "depth",
          "name": "深度分析",
          "description": "内容有深度，分析透彻",
          "weight": 15,
          "score_range": [1, 5]
        },
        {
          "id": "originality",
          "name": "原创性",
          "description": "内容原创，有独特见解",
          "weight": 10,
          "score_range": [1, 5]
        }
      ]
    },
    {
      "id": "structure_clarity",
      "name": "结构清晰度",
      "weight": 30,
      "description": "评估文章的组织结构和逻辑性",
      "criteria": [
        {
          "id": "logic",
          "name": "逻辑性",
          "description": "文章逻辑清晰，论证有力",
          "weight": 15,
          "score_range": [1, 5]
        },
        {
          "id": "organization",
          "name": "组织结构",
          "description": "文章结构合理，层次分明",
          "weight": 15,
          "score_range": [1, 5]
        }
      ]
    },
    {
      "id": "readability",
      "name": "可读性",
      "weight": 30,
      "description": "评估文章的表达和阅读体验",
      "criteria": [
        {
          "id": "language",
          "name": "语言表达",
          "description": "语言流畅，表达清晰",
          "weight": 15,
          "score_range": [1, 5]
        },
        {
          "id": "engagement",
          "name": "吸引力",
          "description": "内容生动有趣，能吸引读者",
          "weight": 15,
          "score_range": [1, 5]
        }
      ]
    }
  ],
  "scoring_algorithm": {
    "description": "加权平均算法",
    "formula": "总分 = Σ(类别权重 × 类别得分)",
    "normalization": "最终得分归一化到0-100分"
  }
};

const standardPrompt = `请根据以下需求生成一个完整的内容质量评估标准：

系统名称：{{systemName}}
系统描述：{{systemDescription}}

请返回一个JSON格式的评估标准，包含以下结构：
- 评估系统基本信息
- 多个评估类别（数组），每个类别包含权重和描述
- 每个类别下的具体评估标准（数组）
- 每个标准的权重和评分范围

请确保权重分配合理，覆盖全面，适合对文章内容进行客观评估。

以下是JSON结构示例：
${JSON.stringify(standardPromptExampleJson, null, 2)}
请严格按照上述结构返回JSON。`

export default standardPrompt; 