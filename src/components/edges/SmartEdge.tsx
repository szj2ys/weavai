"use client";

import {
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getSimpleBezierPath,
  EdgeLabelRenderer,
} from "@xyflow/react";

// 智能边组件 - 根据节点位置自动选择最佳路径
export function SmartEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) {
  // 计算节点间的距离和方向
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // 根据距离和方向选择合适的路径类型
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  // 如果是垂直或水平对齐，使用平滑步进路径
  if (Math.abs(deltaX) < 50 || Math.abs(deltaY) < 50) {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 20,
    });
  } else {
    // 否则使用贝塞尔曲线
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.25,
    });
  }

  // 根据边的类型设置样式
  const edgeStyle = {
    strokeWidth: 2.5,
    stroke: data?.type === "conditional" ? "#f59e0b" : "var(--border)",
    strokeDasharray: data?.animated ? "6,6" : "none",
    opacity: 0.9,
    ...style,
  } as React.CSSProperties;

  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* 边标签 */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              // 给不同条件一个轻微的偏移，避免多标签完全重叠
              transform: `translate(-50%, -50%) translate(${labelX + (data?.condition === 'yes' ? 10 : data?.condition === 'no' ? -10 : 0)}px,${labelY + (data?.condition === 'yes' ? -6 : data?.condition === 'no' ? 6 : 0)}px)`,
              fontSize: 12,
              fontWeight: 600,
              pointerEvents: "all",
            }}
            className="nodrag nopan bg-popover text-popover-foreground px-2 py-1 rounded-md shadow-sm border border-border"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// 条件边组件 - 专门用于决策节点的条件分支
export function ConditionalEdge(props: EdgeProps) {
  const { data } = props;

  // 根据条件类型设置不同的颜色
  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "yes":
      case "true":
        return "#10b981"; // green
      case "no":
      case "false":
        return "#ef4444"; // red
      default:
        return "#3b82f6"; // blue
    }
  };

  const conditionColor = getConditionColor(data?.condition);

  return (
    <SmartEdge
      {...props}
      style={{
        stroke: conditionColor,
        strokeWidth: 3,
        ...props.style,
      }}
    />
  );
}
