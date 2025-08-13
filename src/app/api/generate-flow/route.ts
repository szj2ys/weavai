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
      return NextResponse.json(
        { error: "Please provide process description" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional flowchart designer. Based on the user's description, generate structured flowchart data.

User description: ${description}

Please return a JSON object containing nodes and edges arrays in the following format:
{
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "data": { 
        "label": "Start",
        "description": "Process start point"
      },
      "position": { "x": 250, "y": 0 }
    },
    {
      "id": "process1",
      "type": "process",
      "data": { 
        "label": "Process Step",
        "description": "Specific processing operation"
      },
      "position": { "x": 250, "y": 100 }
    },
    {
      "id": "decision1",
      "type": "decision",
      "data": { 
        "label": "Decision",
        "description": "Branch based on condition",
        "conditions": [
          { "id": "yes", "label": "Yes", "value": true },
          { "id": "no", "label": "No", "value": false }
        ]
      },
      "position": { "x": 250, "y": 200 }
    },
    {
      "id": "end",
      "type": "end",
      "data": { 
        "label": "End",
        "description": "Process end point"
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
        "label": "Yes",
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
        "label": "No",
        "condition": "no",
        "type": "conditional"
      }
    }
  ]
}

Node type descriptions:
- "start": Start node (green oval)
- "end": End node (red oval)
- "process": Process node (blue rectangle)
- "decision": Decision node (yellow diamond, must have multiple outputs)
- "input": Input node (purple parallelogram)
- "output": Output node (purple parallelogram)
- "document": Document node (orange special shape)
- "database": Database node (indigo cylinder)

Edge property descriptions:
- source/target: Connected node IDs
- label: Edge label (such as "Yes/No" for conditional branches)
- sourceHandle: Specific connection point of source node (use "yes"/"no" for decision nodes)
- animated: Whether to show animation effect

Requirements:
1. Must have one "start" type start node
2. Must have at least one "end" type end node
3. Choose appropriate node types based on process characteristics
4. Decision nodes must have at least two output edges, distinguished by sourceHandle
5. Node positions should be reasonably distributed to avoid overlap
6. Edges should accurately describe the flow relationship between nodes
7. Add appropriate label descriptions for complex conditions
8. Only return JSON data, no other text descriptions

Please generate complete flowchart data based on the description:
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
      console.warn("AI response is empty, using fallback flowchart");
      return NextResponse.json(generateFallbackFlow(description));
    }

    // 尝试解析JSON
    let flowData;
    try {
      // 清理可能的markdown代码块标记
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      flowData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Original content:", content);
      console.warn("Using fallback flowchart");
      return NextResponse.json(generateFallbackFlow(description));
    }

    // 验证数据结构
    const validatedData = validateFlowData(flowData);
    if (!validatedData) {
      console.warn(
        "Flowchart data validation failed, using fallback flowchart"
      );
      return NextResponse.json(generateFallbackFlow(description));
    }

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Generate flowchart error:", error);

    // 如果是API调用失败，返回备用流程图而不是错误
    if (error instanceof Error && error.message.includes("API")) {
      console.warn("API call failed, using fallback flowchart");
      const { description } = await request.json();
      return NextResponse.json(
        generateFallbackFlow(description || "flowchart")
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate flowchart",
      },
      { status: 500 }
    );
  }
}
