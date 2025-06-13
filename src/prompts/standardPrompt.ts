// AI内容质量评估标准生成提示词

export const standardPromptExampleJson = {
  "name": "AI内容质量评估系统",
  "description": "用于评估AI生成内容质量的多维度标准体系",
  "version": "1.0",
  "total_weight": 100,
  "criteria": [
    {
      "id": "accuracy",
      "name": "准确性",
      "description": {
        "1": "存在明显事实错误或数据不准确",
        "2": "大部分事实正确，但有少量错误或不准确之处",
        "3": "事实基本准确，数据来源可靠",
        "4": "事实准确，数据可靠，引用权威来源",
        "5": "事实完全准确，数据高度可靠，多重验证"
      },
      "weight": 20,
      "score_range": [1, 5]
    },
    {
      "id": "depth",
      "name": "深度分析",
      "description": {
        "1": "内容表面化，缺乏深入分析",
        "2": "有细分点但论述不够深入",
        "3": "细分论述较为充分，层次清晰",
        "4": "层层推进分析，论据充分",
        "5": "充分论证并提出新见解，分析透彻深入"
      },
      "weight": 20,
      "score_range": [1, 5]
    },
    {
      "id": "originality",
      "name": "原创性",
      "description": {
        "1": "内容完全重复已有观点，无创新",
        "2": "主要重复已有内容，偶有新意",
        "3": "在已有基础上有适度创新和改进",
        "4": "提出较为独特的观点和见解",
        "5": "高度原创，提出突破性见解或创新方法"
      },
      "weight": 15,
      "score_range": [1, 5]
    },
    {
      "id": "logic",
      "name": "逻辑性",
      "description": {
        "1": "逻辑混乱，论证无效或存在明显漏洞",
        "2": "逻辑基本清晰但存在推理缺陷",
        "3": "逻辑清晰，论证基本有效",
        "4": "逻辑严密，论证有力且连贯",
        "5": "逻辑极其严密，论证完美无缺，推理无懈可击"
      },
      "weight": 15,
      "score_range": [1, 5]
    },
    {
      "id": "organization",
      "name": "组织结构",
      "description": {
        "1": "结构混乱，层次不清，难以理解",
        "2": "结构基本合理但层次安排有问题",
        "3": "结构合理，层次分明，易于理解",
        "4": "结构严谨，层次清晰，逻辑顺序优秀",
        "5": "结构完美，层次分明，组织架构堪称典范"
      },
      "weight": 15,
      "score_range": [1, 5]
    },
    {
      "id": "language",
      "name": "语言表达",
      "description": {
        "1": "语言表达不清，存在语法错误或表达混乱",
        "2": "语言基本通顺但表达不够准确或流畅",
        "3": "语言流畅，表达清晰，基本达意",
        "4": "语言优美流畅，表达准确生动",
        "5": "语言运用炉火纯青，表达精准优雅，具有很强的感染力"
      },
      "weight": 15,
      "score_range": [1, 5]
    }
  ],
  "scoring_algorithm": {
    "description": "加权平均算法",
    "formula": "总分 = Σ(标准权重 × 标准得分)",
    "normalization": "最终得分归一化到0-100分"
  }
};

const standardPrompt = `请根据以下需求生成一个完整的内容质量评估标准：

标准名称：{{systemName}}
标准描述：{{systemDescription}}

请返回一个JSON格式的评估标准，包含以下结构：
- 评估系统基本信息（name, description, version）
- 评估标准列表（criteria数组），每个标准包含：
  - id: 唯一标识符
  - name: 标准名称
  - description: 标准描述（包含1-5分的详细评分标准）
  - weight: 权重（所有标准权重之和应为100）
  - score_range: 评分范围（建议[1,5]）
- 评分算法说明

请确保：
1. 权重分配合理，总和为100
2. 标准覆盖全面，适合对内容进行客观评估
3. 每个标准都有详细的1-5分评分描述
4. JSON格式严格规范：
   - 所有属性名和字符串值必须使用双引号
   - 不要使用任何特殊字符或Unicode字符
   - 不要有多余的空格和换行
   - 确保所有数值类型正确（weight为数字，score_range为数字数组）

以下是JSON结构示例：
${JSON.stringify(standardPromptExampleJson, null, 2)}
请严格按照上述结构返回JSON。`

export default standardPrompt;