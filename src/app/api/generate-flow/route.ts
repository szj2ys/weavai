import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validateFlowData, generateFallbackFlow } from "@/lib/flowUtils";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "请提供流程描述" }, { status: 400 });
    }

    const prompt = `
你是一个专业的流程图设计师。根据用户的描述，生成一个结构化的流程图数据。

用户描述：${description}

请返回一个JSON对象，包含nodes和edges数组，格式如下：
{
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "data": { 
        "label": "开始",
        "description": "流程开始点"
      },
      "position": { "x": 250, "y": 0 }
    },
    {
      "id": "process1",
      "type": "process",
      "data": { 
        "label": "处理步骤",
        "description": "具体的处理操作"
      },
      "position": { "x": 250, "y": 100 }
    },
    {
      "id": "decision1",
      "type": "decision",
      "data": { 
        "label": "判断条件",
        "description": "根据条件进行分支",
        "conditions": [
          { "id": "yes", "label": "是", "value": true },
          { "id": "no", "label": "否", "value": false }
        ]
      },
      "position": { "x": 250, "y": 200 }
    },
    {
      "id": "end",
      "type": "end",
      "data": { 
        "label": "结束",
        "description": "流程结束点"
      },
      "position": { "x": 250, "y": 300 }
    }
  ],
  "edges": [
    {
      "id": "start-process1",
      "source": "start",
      "target": "process1",
      "animated": true
    },
    {
      "id": "process1-decision1",
      "source": "process1",
      "target": "decision1",
      "animated": true
    },
    {
      "id": "decision1-end-yes",
      "source": "decision1",
      "target": "end",
      "type": "conditional",
      "sourceHandle": "yes",
      "animated": true,
      "data": {
        "label": "是",
        "condition": "yes",
        "type": "conditional"
      }
    },
    {
      "id": "decision1-end-no",
      "source": "decision1",
      "target": "end",
      "type": "conditional",
      "sourceHandle": "no",
      "animated": true,
      "data": {
        "label": "否",
        "condition": "no",
        "type": "conditional"
      }
    }
  ]
}

节点类型说明：
- "start": 开始节点（绿色椭圆）
- "end": 结束节点（红色椭圆）
- "process": 处理节点（蓝色矩形）
- "decision": 决策节点（黄色菱形，必须有多个输出）
- "input": 输入节点（紫色平行四边形）
- "output": 输出节点（紫色平行四边形）
- "document": 文档节点（橙色特殊形状）
- "database": 数据库节点（靛蓝色圆柱形）

边的属性说明：
- source/target: 连接的节点ID
- label: 边的标签（如条件分支的"是/否"）
- sourceHandle: 源节点的特定连接点（决策节点用"yes"/"no"）
- animated: 是否显示动画效果

要求：
1. 必须有一个type为"start"的开始节点
2. 必须有至少一个type为"end"的结束节点
3. 根据流程特点选择合适的节点类型
4. 决策节点必须有至少两个输出边，使用sourceHandle区分
5. 节点位置要合理分布，避免重叠
6. 边要准确描述节点间的流向关系
7. 为复杂条件添加适当的label说明
8. 只返回JSON数据，不要其他文字说明

请根据描述生成完整的流程图数据：
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
      // ModelScope API 特定参数
      enable_thinking: false,
    } as any);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn("AI 响应为空，使用备用流程图");
      return NextResponse.json(generateFallbackFlow(description));
    }

    // 尝试解析JSON
    let flowData;
    try {
      // 清理可能的markdown代码块标记
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      flowData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON解析错误:", parseError);
      console.error("原始内容:", content);
      console.warn("使用备用流程图");
      return NextResponse.json(generateFallbackFlow(description));
    }

    // 验证数据结构
    const validatedData = validateFlowData(flowData);
    if (!validatedData) {
      console.warn("流程图数据验证失败，使用备用流程图");
      return NextResponse.json(generateFallbackFlow(description));
    }

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("生成流程图错误:", error);

    // 如果是API调用失败，返回备用流程图而不是错误
    if (error instanceof Error && error.message.includes("API")) {
      console.warn("API调用失败，使用备用流程图");
      const { description } = await request.json();
      return NextResponse.json(generateFallbackFlow(description || "流程图"));
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "生成流程图失败" },
      { status: 500 }
    );
  }
}
