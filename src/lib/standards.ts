// 标准常量统一管理
export const DEFAULT_STANDARDS = [
    {
        "name": "行业资讯评估",
        "description": "行业的发展前景，包括当前市场容量、未来市场容量及增速，政策扶持力度等",
        "version": "1.0",
        "total_weight": 100,
        "categories": [
            {
                "id": "market_size",
                "name": "市场容量",
                "weight": 30,
                "description": "评估当前和未来的市场容量及增长速度",
                "criteria": [
                    {
                        "id": "current_market",
                        "name": "当前市场容量",
                        "description": "当前市场的规模和实际容量",
                        "weight": 15,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "future_market",
                        "name": "未来市场容量",
                        "description": "未来市场的预测容量及增长趋势",
                        "weight": 15,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "growth_rate",
                "name": "增长速度",
                "weight": 20,
                "description": "评估市场的增长速度和潜力",
                "criteria": [
                    {
                        "id": "current_growth",
                        "name": "当前增长速度",
                        "description": "当前市场的增长率",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "future_growth",
                        "name": "未来增长潜力",
                        "description": "未来市场的增长潜力和预期",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "policy_support",
                "name": "政策扶持",
                "weight": 25,
                "description": "评估政府和相关政策对行业的支持程度",
                "criteria": [
                    {
                        "id": "current_policy",
                        "name": "现有政策",
                        "description": "当前政策对行业发展的支持力度",
                        "weight": 15,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "future_policy",
                        "name": "未来政策预期",
                        "description": "未来政策对行业发展的预期支持",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "content_quality",
                "name": "内容质量",
                "weight": 25,
                "description": "评估内容的专业性、准确性和深度",
                "criteria": [
                    {
                        "id": "accuracy",
                        "name": "准确性",
                        "description": "内容事实准确，数据可靠",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "depth",
                        "name": "深度分析",
                        "description": "内容有深度，分析透彻",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "relevance",
                        "name": "相关性",
                        "description": "内容与行业发展的相关性",
                        "weight": 5,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            }
        ],
        "scoring_algorithm": {
            "description": "加权平均算法",
            "formula": "总分 = Σ(类别权重 × 类别得分)",
            "normalization": "最终得分归一化到0-100分"
        }
    },
    {
        "name": "公司分析内容质量评估系统",
        "description": "用于评估公司在行业内的技术、产品、品牌、客户、销售能力、成本控制、产能等方面的综合竞争力的内容质量",
        "version": "1.0",
        "total_weight": 100,
        "categories": [
            {
                "id": "technical_analysis",
                "name": "技术分析",
                "weight": 20,
                "description": "评估公司在技术方面的竞争力",
                "criteria": [
                    {
                        "id": "innovation",
                        "name": "创新能力",
                        "description": "公司在技术创新和研发方面的表现",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "patents",
                        "name": "专利数量",
                        "description": "公司拥有的专利数量和质量",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "product_quality",
                "name": "产品质量",
                "weight": 20,
                "description": "评估公司在产品方面的竞争力",
                "criteria": [
                    {
                        "id": "performance",
                        "name": "产品性能",
                        "description": "产品的性能和用户体验",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "reliability",
                        "name": "可靠性",
                        "description": "产品的可靠性和稳定性",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "brand_strength",
                "name": "品牌实力",
                "weight": 15,
                "description": "评估公司在品牌方面的竞争力",
                "criteria": [
                    {
                        "id": "brand_recognition",
                        "name": "品牌认知度",
                        "description": "品牌的市场认知度和知名度",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "brand_loyalty",
                        "name": "品牌忠诚度",
                        "description": "客户的品牌忠诚度和满意度",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "customer_base",
                "name": "客户基础",
                "weight": 15,
                "description": "评估公司在客户方面的竞争力",
                "criteria": [
                    {
                        "id": "customer_diversity",
                        "name": "客户多样性",
                        "description": "客户群体的多样性和分布",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "customer_retention",
                        "name": "客户保留率",
                        "description": "客户的保留率和复购率",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "sales_performance",
                "name": "销售能力",
                "weight": 15,
                "description": "评估公司在销售方面的竞争力",
                "criteria": [
                    {
                        "id": "sales_growth",
                        "name": "销售增长率",
                        "description": "公司的销售增长率和市场占有率",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    },
                    {
                        "id": "sales_channels",
                        "name": "销售渠道",
                        "description": "公司的销售渠道和销售网络",
                        "weight": 7.5,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "cost_control",
                "name": "成本控制",
                "weight": 10,
                "description": "评估公司在成本控制方面的竞争力",
                "criteria": [
                    {
                        "id": "cost_efficiency",
                        "name": "成本效率",
                        "description": "公司的成本控制和效率",
                        "weight": 10,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            },
            {
                "id": "production_capacity",
                "name": "产能",
                "weight": 5,
                "description": "评估公司的生产能力和效率",
                "criteria": [
                    {
                        "id": "production_output",
                        "name": "产能输出",
                        "description": "公司的产能和生产效率",
                        "weight": 5,
                        "score_range": [
                            1,
                            5
                        ]
                    }
                ]
            }
        ],
        "scoring_algorithm": {
            "description": "加权平均算法",
            "formula": "总分 = Σ(类别权重 × 类别得分)",
            "normalization": "最终得分归一化到0-100分"
        }
    },

];