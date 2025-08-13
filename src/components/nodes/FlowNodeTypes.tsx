"use client";

import { NodeProps } from "@xyflow/react";
import { FlowNode } from "./FlowNode";
import { NodeType } from "@/types/flowchart";

// 为不同类型的节点创建包装组件
export function StartNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "start" as NodeType }} />;
}

export function EndNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "end" as NodeType }} />;
}

export function ProcessNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "process" as NodeType }} />;
}

export function DecisionNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "decision" as NodeType }} />;
}

export function InputNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "input" as NodeType }} />;
}

export function OutputNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "output" as NodeType }} />;
}

export function ConnectorNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "connector" as NodeType }} />;
}

export function DocumentNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "document" as NodeType }} />;
}

export function DatabaseNode({ data }: NodeProps) {
  return <FlowNode data={{ ...data, type: "database" as NodeType }} />;
}

// 导出节点类型映射
export const flowNodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
  input: InputNode,
  output: OutputNode,
  connector: ConnectorNode,
  document: DocumentNode,
  database: DatabaseNode,
};
