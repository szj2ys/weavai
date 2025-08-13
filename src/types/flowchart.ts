// 流程图节点类型
export type NodeType =
  | "start" // 开始节点（椭圆形）
  | "end" // 结束节点（椭圆形）
  | "process" // 处理节点（矩形）
  | "decision" // 决策节点（菱形）
  | "input" // 输入节点（平行四边形）
  | "output" // 输出节点（平行四边形）
  | "connector" // 连接器（圆形）
  | "document" // 文档节点（特殊形状）
  | "database"; // 数据库节点（圆柱形）

// 流程图节点定义
export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  position: {
    x: number;
    y: number;
  };
  // 决策节点的条件选项
  conditions?: {
    id: string;
    label: string;
    value: string | boolean;
  }[];
  // 节点的额外属性
  properties?: Record<string, any>;
}

// 流程图边定义
export interface FlowEdge {
  id: string;
  source: string; // 源节点ID
  target: string; // 目标节点ID
  label?: string; // 边的标签（如：是/否，条件等）
  type?: "default" | "conditional" | "parallel";
  // 条件边的条件值
  condition?: {
    field: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains";
    value: any;
  };
  // 边的样式
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  animated?: boolean;
}

// 完整的流程图数据结构
export interface FlowchartData {
  nodes: FlowNode[];
  edges: FlowEdge[];
  // 流程图元数据
  metadata?: {
    title?: string;
    description?: string;
    version?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// 流程图验证规则
export interface ValidationRule {
  // 每个流程图必须有且仅有一个开始节点
  hasUniqueStart: boolean;
  // 每个流程图必须至少有一个结束节点
  hasAtLeastOneEnd: boolean;
  // 所有节点都必须可达（从开始节点出发）
  allNodesReachable: boolean;
  // 决策节点必须有至少两个出边
  decisionNodesHaveMultipleOutputs: boolean;
  // 不能有孤立的节点
  noOrphanNodes: boolean;
}

// 流程图布局选项
export interface LayoutOptions {
  direction: "TB" | "BT" | "LR" | "RL"; // 布局方向
  nodeSpacing: {
    horizontal: number;
    vertical: number;
  };
  edgeSpacing: number;
  alignment: "start" | "center" | "end";
}
