import { Node, Edge } from "@xyflow/react";
import { FlowchartData, FlowNode, FlowEdge, NodeType } from "@/types/flowchart";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export function validateFlowData(data: any): FlowData | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return null;
  }

  // 验证节点结构
  for (const node of data.nodes) {
    if (!node.id || !node.data || !node.position) {
      return null;
    }
    if (
      typeof node.position.x !== "number" ||
      typeof node.position.y !== "number"
    ) {
      return null;
    }
  }

  // 验证边结构
  for (const edge of data.edges) {
    if (!edge.id || !edge.source || !edge.target) {
      return null;
    }
  }

  // 过滤未知节点类型到默认类型，避免渲染崩溃
  const knownTypes: NodeType[] = [
    "start",
    "end",
    "process",
    "decision",
    "input",
    "output",
    "connector",
    "document",
    "database",
  ];

  const sanitizedNodes = data.nodes.map((node: any) => {
    const nodeType = knownTypes.includes(node.type) ? node.type : "process";
    return { ...node, type: nodeType };
  });

  // 过滤引用了不存在节点的边
  const nodeIds = new Set(sanitizedNodes.map((n: any) => n.id));
  const sanitizedEdges = data.edges.filter(
    (e: any) => nodeIds.has(e.source) && nodeIds.has(e.target)
  );

  const sanitized: FlowData = { nodes: sanitizedNodes, edges: sanitizedEdges };

  // 验证流程图规则
  const hasStart = sanitized.nodes.some((node: any) => node.type === "start");
  const hasEnd = sanitized.nodes.some((node: any) => node.type === "end");
  if (!hasStart || !hasEnd) {
    console.warn("流程图缺少开始或结束节点");
  }

  return sanitized;
}

export function generateFallbackFlow(description: string): FlowData {
  const steps = extractStepsFromDescription(description);

  const nodes: Node[] = [
    {
      id: "start",
      type: "start",
      data: {
        label: "开始",
        description: "流程开始",
      },
      position: { x: 250, y: 0 },
    },
  ];

  const edges: Edge[] = [];

  // 添加步骤节点
  steps.forEach((step, index) => {
    const nodeId = `process${index + 1}`;
    nodes.push({
      id: nodeId,
      type: "process",
      data: {
        label: step.name,
        description: step.description,
      },
      position: { x: 250, y: (index + 1) * 120 },
    });

    // 添加连接边
    const sourceId = index === 0 ? "start" : `process${index}`;
    edges.push({
      id: `${sourceId}-${nodeId}`,
      source: sourceId,
      target: nodeId,
      type: "smart",
      animated: true,
      data: {
        type: "default",
      },
    });
  });

  // 添加结束节点
  const endNodeId = "end";
  nodes.push({
    id: endNodeId,
    type: "end",
    data: {
      label: "结束",
      description: "流程结束",
    },
    position: { x: 250, y: (steps.length + 1) * 120 },
  });

  // 添加到结束节点的边
  const lastStepId = `process${steps.length}`;
  edges.push({
    id: `${lastStepId}-${endNodeId}`,
    source: lastStepId,
    target: endNodeId,
    type: "smart",
    animated: true,
    data: {
      type: "default",
    },
  });

  return { nodes, edges };
}

interface ProcessStep {
  name: string;
  description: string;
  type?: NodeType;
}

function extractStepsFromDescription(description: string): ProcessStep[] {
  // 根据描述内容生成更智能的步骤
  if (description.includes("注册") || description.includes("登录")) {
    return [
      { name: "填写信息", description: "用户输入注册信息", type: "input" },
      { name: "验证信息", description: "系统验证信息有效性", type: "process" },
      {
        name: "信息是否有效",
        description: "判断信息是否符合要求",
        type: "decision",
      },
      { name: "创建账户", description: "在系统中创建新账户", type: "process" },
      { name: "发送确认", description: "发送注册成功通知", type: "output" },
    ];
  }

  if (description.includes("订单") || description.includes("购买")) {
    return [
      { name: "选择商品", description: "用户浏览并选择商品", type: "input" },
      {
        name: "添加到购物车",
        description: "将商品加入购物车",
        type: "process",
      },
      { name: "确认订单", description: "用户确认订单信息", type: "process" },
      { name: "库存是否充足", description: "检查商品库存", type: "decision" },
      { name: "支付处理", description: "处理用户支付", type: "process" },
      { name: "订单完成", description: "生成订单并通知用户", type: "output" },
    ];
  }

  if (description.includes("开发") || description.includes("软件")) {
    return [
      { name: "需求分析", description: "分析项目需求", type: "input" },
      { name: "设计方案", description: "制定技术方案", type: "process" },
      { name: "编码实现", description: "编写代码实现功能", type: "process" },
      { name: "测试验证", description: "测试功能是否正常", type: "process" },
      { name: "测试是否通过", description: "判断测试结果", type: "decision" },
      { name: "部署上线", description: "将系统部署到生产环境", type: "output" },
    ];
  }

  // 默认通用流程
  return [
    { name: "输入信息", description: "接收输入数据", type: "input" },
    { name: "验证数据", description: "验证数据有效性", type: "process" },
    { name: "处理请求", description: "执行业务逻辑", type: "process" },
    { name: "返回结果", description: "输出处理结果", type: "output" },
  ];
}
