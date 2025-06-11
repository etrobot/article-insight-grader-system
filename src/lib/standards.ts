// 标准常量统一管理
export const DEFAULT_STANDARDS = [
    {
        "name": "内外部催化剂因子",
        "description": "任何有利于股价上涨的催化剂，包括政策方向、行业变局、重组概念等",
        "evaluation_system": {
            "name": "内外部催化剂因子质量评估系统",
            "description": "用于评估与股价上涨相关的催化剂内容质量的标准体系，涵盖政策方向、行业变局、重组概念等",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "information_accuracy",
                    "name": "信息准确性",
                    "weight": 30,
                    "description": "评估催化剂信息的事实正确性、可靠性和来源",
                    "criteria": [
                        {
                            "id": "fact_accuracy",
                            "name": "事实准确性",
                            "description": "内容事实准确，无错误信息",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "source_credibility",
                            "name": "来源可信度",
                            "description": "信息来源权威可靠，如官方发布或知名机构",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "consistency",
                            "name": "信息一致性",
                            "description": "信息内部逻辑一致，无矛盾之处",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "relevance_impact",
                    "name": "相关性和影响",
                    "weight": 25,
                    "description": "评估催化剂与股价上涨的相关性及其潜在市场影响",
                    "criteria": [
                        {
                            "id": "market_relevance",
                            "name": "市场相关性",
                            "description": "催化剂对股价或市场的影响直接且相关",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "impact_assessment",
                            "name": "影响力度",
                            "description": "对股价的潜在影响大小，有数据或分析支持",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "evidence_strength",
                            "name": "证据强度",
                            "description": "有可靠数据、图表或引用支持影响评估",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "timeliness_importance",
                    "name": "时效性和重要性",
                    "weight": 20,
                    "description": "评估催化剂信息的及时性和对投资者的重要程度",
                    "criteria": [
                        {
                            "id": "timeliness",
                            "name": "时效性",
                            "description": "信息发布时间是否及时，反映最新事件",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "newsworthiness",
                            "name": "新闻价值",
                            "description": "是否是新事件或趋势，具有市场关注度",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "analysis_depth",
                    "name": "分析深度",
                    "weight": 15,
                    "description": "评估对催化剂的分析的透彻性和深度",
                    "criteria": [
                        {
                            "id": "analysis_thoroughness",
                            "name": "分析透彻性",
                            "description": "分析考虑多方面因素，逻辑严谨",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "insightfulness",
                            "name": "见解深度",
                            "description": "提供独特或有价值的见解，超越表面信息",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "structure_readability",
                    "name": "结构和可读性",
                    "weight": 10,
                    "description": "评估内容的组织结构和表达清晰度",
                    "criteria": [
                        {
                            "id": "logical_structure",
                            "name": "逻辑结构",
                            "description": "内容逻辑清晰，组织合理，易于跟随",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "expressiveness",
                            "name": "表达清晰度",
                            "description": "语言流畅，易于读者理解，避免晦涩",
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
        "id": "1749634470084",
        "createdAt": "2025-06-11T09:34:30.084Z"
    },
    {
        "name": "估值水平",
        "description": "当前公司估值水平对比自身历史估值，以及行业可比公司的估值",
        "evaluation_system": {
            "name": "估值水平",
            "description": "当前公司估值水平对比自身历史估值，以及行业可比公司的估值",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "data_accuracy",
                    "name": "数据准确性",
                    "weight": 30,
                    "description": "评估估值数据的准确性和可靠性，包括历史估值和行业可比公司数据",
                    "criteria": [
                        {
                            "id": "historical_data_accuracy",
                            "name": "历史估值数据准确性",
                            "description": "评估自身历史估值数据的准确性和来源可靠性",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "comparable_data_accuracy",
                            "name": "可比公司估值数据准确性",
                            "description": "评估行业可比公司估值数据的准确性和来源权威性",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "analysis_depth",
                    "name": "分析深度",
                    "weight": 30,
                    "description": "评估对估值水平变化原因的深入分析和趋势预测",
                    "criteria": [
                        {
                            "id": "reason_analysis",
                            "name": "估值原因分析",
                            "description": "评估对当前估值水平变化原因的详细解释和逻辑推理",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "trend_analysis",
                            "name": "趋势预测",
                            "description": "评估对估值趋势的合理预测和影响因素分析",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "comparative_analysis",
                    "name": "比较分析",
                    "weight": 20,
                    "description": "评估自身历史估值与行业可比公司估值的对比全面性和合理性",
                    "criteria": [
                        {
                            "id": "historical_comparison",
                            "name": "历史对比分析",
                            "description": "评估自身历史估值水平的对比分析，包括变化趋势和原因",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "comparable_comparison",
                            "name": "可比公司对比分析",
                            "description": "评估与行业可比公司估值的对比，识别差异、优势和行业基准",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "presentation_quality",
                    "name": "呈现质量",
                    "weight": 20,
                    "description": "评估内容的整体表达、逻辑性和可读性",
                    "criteria": [
                        {
                            "id": "logical_clarity",
                            "name": "逻辑清晰度",
                            "description": "评估内容逻辑结构是否清晰，论证是否有力",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "readability",
                            "name": "可读性",
                            "description": "评估语言表达是否流畅，易于理解和吸引读者",
                            "weight": 10,
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
        "id": "1749629655167",
        "createdAt": "2025-06-11T08:14:15.167Z"
    },
    {
        "name": "股价走势",
        "description": "当前股价位置及未来上涨空间，近期成交量的边际变化，是否有资金布局迹象，放量下跌/上涨，缩量下跌/上涨",
        "evaluation_system": {
            "name": "股价走势内容质量评估系统",
            "description": "用于评估股票分析内容在股价走势方面的质量标准，包括当前股价位置、未来上涨空间、成交量变化、资金流向及价格行为",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "stock_price_analysis",
                    "name": "股价分析",
                    "weight": 40,
                    "description": "评估当前股价位置及未来上涨空间的分析准确性、深度和合理性",
                    "criteria": [
                        {
                            "id": "current_position",
                            "name": "当前股价位置准确性",
                            "description": "分析当前股价位置是否准确，基于可靠数据和市场背景",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "future_space",
                            "name": "未来上涨空间预测",
                            "description": "预测未来上涨空间的合理性，包括支撑因素和风险提示",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "analysis_depth",
                            "name": "分析深度",
                            "description": "对影响股价因素（如宏观经济、公司基本面等）的深入探讨",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "volume_analysis",
                    "name": "成交量分析",
                    "weight": 30,
                    "description": "评估近期成交量的边际变化及其对股价走势的影响",
                    "criteria": [
                        {
                            "id": "volume_change",
                            "name": "成交量边际变化",
                            "description": "近期成交量变化的分析准确性，是否反映市场活跃度",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "volume_impact",
                            "name": "成交量对股价影响",
                            "description": "分析成交量变化对股价的潜在驱动作用，如支撑或阻力",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "price_behavior",
                    "name": "价格行为",
                    "weight": 20,
                    "description": "评估放量和缩量下跌/上涨的价格行为模式",
                    "criteria": [
                        {
                            "id": "bullish_behavior",
                            "name": "放量上涨分析",
                            "description": "分析放量上涨是否可持续，是否有强劲上涨迹象",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "bearish_behavior",
                            "name": "放量下跌分析",
                            "description": "分析放量下跌是否表示潜在风险或反转",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "low_volume_behavior",
                            "name": "缩量行为分析",
                            "description": "分析缩量下跌或上涨的含义，是否表示市场观望或锁定",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "funds_flow",
                    "name": "资金流向",
                    "weight": 10,
                    "description": "评估是否有资金布局迹象，如机构资金或主力资金的介入",
                    "criteria": [
                        {
                            "id": "funds_indication",
                            "name": "资金布局分析",
                            "description": "分析资金是否在布局，包括流入流出数据的可靠性",
                            "weight": 10,
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
                "normalization": "最终得分归一化到0-100范围，其中类别得分是该类别下所有标准得分的加权平均值，权重基于各标准的权重计算"
            }
        },
        "id": "1749626737044",
        "createdAt": "2025-06-11T07:25:37.044Z"
    },
    {
        "name": "公司造血能力分析",
        "description": "公司盈利的质量、制造内生现金流的能力（内部造血能力）以及流动性、资产负债率等财务状况",
        "evaluation_system": {
            "name": "公司造血能力分析",
            "description": "公司盈利的质量、制造内生现金流的能力（内部造血能力）以及流动性、资产负债率等财务状况",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "profitability",
                    "name": "盈利质量",
                    "weight": 20,
                    "description": "评估公司盈利的可持续性和效率，包括毛利率、净利率和盈利稳定性",
                    "criteria": [
                        {
                            "id": "gross_margin",
                            "name": "毛利率",
                            "description": "公司毛利率的水平和趋势，反映产品或服务的盈利能力",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "net_profit_margin",
                            "name": "净利率",
                            "description": "公司净利率的健康状况，表示每单位收入的净利润",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "profit_stability",
                            "name": "盈利稳定性",
                            "description": "公司盈利是否稳定，波动小，反映抗风险能力",
                            "weight": 6,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "cash_flow",
                    "name": "现金流能力",
                    "weight": 25,
                    "description": "评估公司从内部运营产生的现金流能力，包括经营活动现金流、自由现金流和现金流与利润比",
                    "criteria": [
                        {
                            "id": "operating_cf",
                            "name": "经营现金流",
                            "description": "经营活动产生的现金流，反映公司核心业务的现金生成能力",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "free_cf",
                            "name": "自由现金流",
                            "description": "自由现金流的质量，表示可用于投资或分配的现金",
                            "weight": 8,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "cf_to_profit",
                            "name": "现金流与利润比",
                            "description": "现金流与净利润的比率，评估现金流对盈利的支撑程度",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "liquidity",
                    "name": "流动性",
                    "weight": 20,
                    "description": "评估公司满足短期债务的能力，包括流动比率、速动比率和现金持有量",
                    "criteria": [
                        {
                            "id": "current_ratio",
                            "name": "流动比率",
                            "description": "流动资产与流动负债的比率，衡量短期偿债能力",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "quick_ratio",
                            "name": "速动比率",
                            "description": "速动资产与流动负债的比率，排除存货后评估流动性",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "cash_balance",
                            "name": "现金持有量",
                            "description": "公司持有的现金水平，反映应对紧急情况的能力",
                            "weight": 6,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "leverage",
                    "name": "财务杠杆",
                    "weight": 35,
                    "description": "评估公司总资产、负债和所有者权益的健康状况，包括资产负债率、权益比率、资产周转率和偿债能力",
                    "criteria": [
                        {
                            "id": "debt_ratio",
                            "name": "资产负债率",
                            "description": "总负债与总资产的比率，衡量公司杠杆水平和风险",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "equity_ratio",
                            "name": "权益比率",
                            "description": "所有者权益与总资产的比率，评估公司资本结构的稳健性",
                            "weight": 8,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "asset_turnover",
                            "name": "资产周转率",
                            "description": "资产的使用效率，反映公司资产的变现能力和运营效率",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "debt_service",
                            "name": "偿债能力",
                            "description": "公司偿还债务的能力，包括利息保障倍数或类似指标",
                            "weight": 10,
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
                "normalization": "类别得分是其下具体评估标准的加权平均得分，然后总分归一化到0-100分"
            }
        },
        "id": "1749626427321",
        "createdAt": "2025-06-11T07:20:27.321Z"
    },
    {
        "name": "公司盈利分析",
        "description": "公司过去收入及盈利增长历史数据、未来收入盈利增长预期等",
        "evaluation_system": {
            "name": "公司盈利分析内容质量评估系统",
            "description": "用于评估公司盈利分析内容（包括历史数据和未来预期）的质量标准",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "data_accuracy",
                    "name": "数据准确性",
                    "weight": 30,
                    "description": "评估公司盈利分析中历史数据和未来预期数据的准确性和可靠性",
                    "criteria": [
                        {
                            "id": "accuracy",
                            "name": "准确性",
                            "description": "历史数据是否准确反映公司实际收入和盈利增长情况",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "source_reliability",
                            "name": "来源可靠性",
                            "description": "数据来源是否可信、权威，例如官方财务报告或可靠市场研究",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "consistency",
                            "name": "数据一致性",
                            "description": "数据在不同时间段或预测模型之间是否逻辑一致，无明显矛盾",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "analysis_depth",
                    "name": "分析深度",
                    "weight": 25,
                    "description": "评估公司盈利分析内容的透彻性、方法科学性和见解原创性",
                    "criteria": [
                        {
                            "id": "depth",
                            "name": "深度分析",
                            "description": "是否深入挖掘收入和盈利增长的原因、影响因素及潜在风险",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "methodology",
                            "name": "分析方法",
                            "description": "分析是否采用科学、合理的定量或定性方法，如SWOT分析或财务模型",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "originality",
                            "name": "见解原创性",
                            "description": "分析是否提供独特或新颖的见解，而非泛泛而谈",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "prediction_reasonableness",
                    "name": "预测合理性",
                    "weight": 15,
                    "description": "评估未来收入和盈利增长预期的合理性、基于证据和假设",
                    "criteria": [
                        {
                            "id": "assumptions",
                            "name": "假设基础",
                            "description": "未来预期是否基于合理的假设，如市场趋势、经济因素或公司战略",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "evidence",
                            "name": "数据支持",
                            "description": "预测是否有充分的历史数据或外部证据支持，如行业报告或基准比较",
                            "weight": 5,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "structure_clarity",
                    "name": "结构清晰度",
                    "weight": 15,
                    "description": "评估内容的组织逻辑和层次分明性",
                    "criteria": [
                        {
                            "id": "logic",
                            "name": "逻辑性",
                            "description": "分析是否逻辑清晰，论证有力，从历史数据推导到未来预期",
                            "weight": 8,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "organization",
                            "name": "组织结构",
                            "description": "内容是否结构合理，章节分明，易于跟随分析流程",
                            "weight": 7,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "readability",
                    "name": "可读性",
                    "weight": 15,
                    "description": "评估内容的表达流畅性和读者友好度",
                    "criteria": [
                        {
                            "id": "language",
                            "name": "语言表达",
                            "description": "语言是否清晰、简洁，易于理解复杂的财务概念",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "engagement",
                            "name": "吸引力",
                            "description": "内容是否生动有趣，能吸引并保持读者兴趣，如通过图表或案例说明",
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
        "id": "1749621439831",
        "createdAt": "2025-06-11T05:57:19.831Z"
    },
    {
        "name": "管理层信息",
        "description": "管理层行业经验、业务专业度、核心团队的持续研发能力等",
        "evaluation_system": {
            "name": "管理层信息评估系统",
            "description": "用于评估管理层的行业经验、业务专业度、核心团队的持续研发能力等",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "industry_experience",
                    "name": "行业经验",
                    "weight": 25,
                    "description": "评估管理层在相关领域的从业背景和经验水平",
                    "criteria": [
                        {
                            "id": "experience_years",
                            "name": "经验年限",
                            "description": "管理层在相关行业的从业年数，经验是否足够",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "industry_relevance",
                            "name": "行业相关性",
                            "description": "经验与当前业务的匹配度和适应性",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "business_proficiency",
                    "name": "业务专业度",
                    "weight": 30,
                    "description": "评估管理层对业务领域的知识掌握和专业技能水平",
                    "criteria": [
                        {
                            "id": "knowledge_depth",
                            "name": "知识深度",
                            "description": "对业务领域的深入理解和洞察",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "skills_mastery",
                            "name": "技能掌握",
                            "description": "专业技能在实际工作中的应用和熟练度",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "rd_continuity",
                    "name": "持续研发能力",
                    "weight": 45,
                    "description": "评估核心团队在研发方面的持续性、创新能力和稳定性",
                    "criteria": [
                        {
                            "id": "rd_experience",
                            "name": "研发经验",
                            "description": "团队在研发领域的历史经验和专长",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "innovation_ability",
                            "name": "创新能力",
                            "description": "团队持续创新和改进研发项目的能カ",
                            "weight": 20,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "team_stability",
                            "name": "团队稳定性",
                            "description": "核心团队的连续性和避免关键人才流失",
                            "weight": 10,
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
        "id": "1749620522433",
        "createdAt": "2025-06-11T05:42:02.433Z"
    },
    {
        "name": "股东信息",
        "description": "是否有明星股东加持，近期是否有大股东减持？股东支持力度如何？",
        "evaluation_system": {
            "name": "股东信息质量评估系统",
            "description": "用于评估与股东相关的信息内容质量，包括明星股东加持、大股东减持和股东支持力度等因素",
            "version": "1.0",
            "total_weight": 100,
            "categories": [
                {
                    "id": "star_investor",
                    "name": "明星股东加持",
                    "weight": 35,
                    "description": "评估内容中关于明星股东信息的准确性、影响力和深度",
                    "criteria": [
                        {
                            "id": "accuracy",
                            "name": "准确性",
                            "description": "明星股东信息是否真实可靠，数据来源是否权威",
                            "weight": 15,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "impact",
                            "name": "影响力分析",
                            "description": "是否分析了明星股东对公司的潜在影响，如战略协同、市场吸引力等",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "completeness",
                            "name": "信息完整性",
                            "description": "是否全面展示了明星股东的背景、持股比例、入股时间等关键信息",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "major_shiller",
                    "name": "大股东减持动态",
                    "weight": 30,
                    "description": "评估内容中关于大股东减持行为的及时性、合理性和潜在影响",
                    "criteria": [
                        {
                            "id": "timeliness",
                            "name": "时效性",
                            "description": "减持信息是否为最新数据，更新频率是否及时",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "rationale",
                            "name": "减持原因分析",
                            "description": "是否对大股东减持的原因进行了合理分析，如正常套现还是战略调整",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "potential_impact",
                            "name": "潜在影响评估",
                            "description": "是否评估了减持可能对股价、公司治理结构产生的影响",
                            "weight": 10,
                            "score_range": [
                                1,
                                5
                            ]
                        }
                    ]
                },
                {
                    "id": "support_strength",
                    "name": "股东支持力度",
                    "weight": 35,
                    "description": "评估内容中关于股东（包括机构和战略投资者）对公司支持力度的分析深度和准确性",
                    "criteria": [
                        {
                            "id": "financial_support",
                            "name": "财务支持",
                            "description": "是否量化分析股东提供的资金支持，如投资金额、融资轮次等",
                            "weight": 12,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "strategic_alignment",
                            "name": "战略协同",
                            "description": "是否评估了股东与公司战略的契合度，以及可能带来的资源整合",
                            "weight": 12,
                            "score_range": [
                                1,
                                5
                            ]
                        },
                        {
                            "id": "professional_backing",
                            "name": "专业支持",
                            "description": "是否分析了股东提供的行业资源、管理经验等非财务支持",
                            "weight": 11,
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
        "id": "1749620021469",
        "createdAt": "2025-06-11T05:33:41.469Z"
    },
    {
        "name": "公司分析",
        "description": "公司在行业内的技术、产品、品牌、客户、销售能力、成本控制、产能等方面的综合竞争力",
        "evaluation_system": {
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
        "id": "1749613161723",
        "createdAt": "2025-06-11T03:39:21.723Z"
    },
    {
        "name": "行业资讯评估",
        "description": "行业的发展前景，包括当前市场容量、未来市场容量及增速，政策扶持力度等",
        "evaluation_system": {
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
        "id": "1749613062006",
        "createdAt": "2025-06-11T03:37:42.006Z"
    }
]