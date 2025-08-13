"use client";

import { NodeProps } from "@xyflow/react";
import { CustomNode } from "./CustomNode";

export function InputNode({ data }: NodeProps) {
  return <CustomNode data={{ ...data, type: "input" }} />;
}

export function OutputNode({ data }: NodeProps) {
  return <CustomNode data={{ ...data, type: "output" }} />;
}

export function DefaultNode({ data }: NodeProps) {
  return <CustomNode data={{ ...data, type: "default" }} />;
}

export const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
};
