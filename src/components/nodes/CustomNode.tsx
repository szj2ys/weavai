"use client";

import { BaseNode } from "./BaseNode";

interface CustomNodeProps {
  data: {
    label: string;
    type?: "input" | "output" | "default";
  };
}

const mapTypeToVariant = (type?: string) => {
  switch (type) {
    case "input":
      return "event" as const;
    case "output":
      return "noop" as const;
    default:
      return "api" as const;
  }
};

export function CustomNode({ data }: CustomNodeProps) {
  const variant = mapTypeToVariant(data.type);

  // 调试：打印节点数据
  console.log("CustomNode data:", data);

  return (
    <BaseNode
      title={data.label}
      variant={variant}
      disableTargetHandle={data.type === "input"}
      disableSourceHandle={data.type === "output"}
      data={{ id: data.label }}
    />
  );
}
