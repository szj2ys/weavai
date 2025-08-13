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
    console.warn("Flowchart missing start or end node");
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
        label: "Start",
        description: "Process start",
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
      label: "End",
      description: "Process end",
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
  // Generate smarter steps based on description content
  if (
    description.includes("registration") ||
    description.includes("login") ||
    description.includes("register") ||
    description.includes("sign up")
  ) {
    return [
      {
        name: "Fill Information",
        description: "User inputs registration information",
        type: "input",
      },
      {
        name: "Validate Information",
        description: "System validates information validity",
        type: "process",
      },
      {
        name: "Is Information Valid?",
        description: "Check if information meets requirements",
        type: "decision",
      },
      {
        name: "Create Account",
        description: "Create new account in system",
        type: "process",
      },
      {
        name: "Send Confirmation",
        description: "Send registration success notification",
        type: "output",
      },
    ];
  }

  if (
    description.includes("order") ||
    description.includes("purchase") ||
    description.includes("buy") ||
    description.includes("e-commerce")
  ) {
    return [
      {
        name: "Select Product",
        description: "User browses and selects products",
        type: "input",
      },
      {
        name: "Add to Cart",
        description: "Add product to shopping cart",
        type: "process",
      },
      {
        name: "Confirm Order",
        description: "User confirms order information",
        type: "process",
      },
      {
        name: "Is Stock Available?",
        description: "Check product inventory",
        type: "decision",
      },
      {
        name: "Process Payment",
        description: "Handle user payment",
        type: "process",
      },
      {
        name: "Order Complete",
        description: "Generate order and notify user",
        type: "output",
      },
    ];
  }

  if (
    description.includes("development") ||
    description.includes("software") ||
    description.includes("coding") ||
    description.includes("programming")
  ) {
    return [
      {
        name: "Requirements Analysis",
        description: "Analyze project requirements",
        type: "input",
      },
      {
        name: "Design Solution",
        description: "Create technical solution",
        type: "process",
      },
      {
        name: "Code Implementation",
        description: "Write code to implement features",
        type: "process",
      },
      {
        name: "Testing Verification",
        description: "Test if functionality works properly",
        type: "process",
      },
      {
        name: "Does Test Pass?",
        description: "Evaluate test results",
        type: "decision",
      },
      {
        name: "Deploy Online",
        description: "Deploy system to production environment",
        type: "output",
      },
    ];
  }

  // Default generic process
  return [
    {
      name: "Input Information",
      description: "Receive input data",
      type: "input",
    },
    {
      name: "Validate Data",
      description: "Verify data validity",
      type: "process",
    },
    {
      name: "Process Request",
      description: "Execute business logic",
      type: "process",
    },
    {
      name: "Return Result",
      description: "Output processing result",
      type: "output",
    },
  ];
}
