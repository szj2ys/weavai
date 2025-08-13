"use client";

import { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";
import { Link2, Waypoints, CircleOff, CalendarClock } from "lucide-react";

// 完全按照motia的接口定义
interface BaseNodeData {
  id: string;
  nodeConfig?: {
    sourceHandlePosition?: "bottom" | "right";
    targetHandlePosition?: "top" | "left";
  };
}

interface BaseNodeProps {
  title: string;
  subtitle?: string;
  variant: "event" | "api" | "noop" | "cron";
  children?: ReactNode;
  disableSourceHandle?: boolean;
  disableTargetHandle?: boolean;
  data?: BaseNodeData;
  className?: string;
  language?: string;
}

const getNodeIcon = (variant: string) => {
  switch (variant) {
    case "cron":
      return <CalendarClock className="w-5 h-5" />;
    case "api":
      return <Link2 className="w-5 h-5" />;
    case "noop":
      return <CircleOff className="w-5 h-5" />;
    case "event":
      return <Waypoints className="w-5 h-5" />;
    default:
      return <Waypoints className="w-5 h-5" />;
  }
};

const getIconStyles = (variant: string) => {
  switch (variant) {
    case "event":
      return "bg-[rgba(30,118,231,0.2)] text-[rgb(30,118,231)]";
    case "api":
      return "dark:bg-[rgba(192,255,17,0.2)] dark:text-[rgb(192,255,17)] bg-[rgb(231,255,166)] text-[rgb(94,125,11)]";
    case "noop":
      return "bg-[rgba(239,18,229,0.2)] text-[rgb(239,18,229)]";
    case "cron":
      return "bg-[rgba(241,105,15,0.2)] text-[rgb(241,105,15)]";
    default:
      return "bg-[rgba(30,118,231,0.2)] text-[rgb(30,118,231)]";
  }
};

export function BaseNode({
  title,
  subtitle,
  variant,
  children,
  disableSourceHandle,
  disableTargetHandle,
  data,
  className,
}: BaseNodeProps) {
  // 调试：打印BaseNode props
  console.log("BaseNode props:", {
    title,
    variant,
    disableSourceHandle,
    disableTargetHandle,
  });

  return (
    <div className={`p-1 rounded-lg max-w-[350px] ${className || ""}`}>
      <div className="rounded-lg bg-background border border-muted-foreground/30">
        <div className="group relative">
          {/* Node Header - 完全按照motia的样式 */}
          <div className="flex items-center gap-2 p-2 border-b-2 border-muted-foreground/10">
            <div className={`rounded-md p-2 ${getIconStyles(variant)}`}>
              {getNodeIcon(variant)}
            </div>
            <div className="flex flex-1 justify-between items-start gap-4">
              <div className="flex flex-col">
                <div className="text-sm font-semibold leading-[1.25] tracking-[-0.25px]">
                  {title}
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="py-4 px-6 text-sm text-muted-foreground">
              {subtitle}
            </div>
          )}

          {/* Children Content */}
          {children && (
            <div className="p-2">
              <div
                className={`space-y-3 p-4 text-sm text-muted-foreground ${
                  variant !== "noop" ? "bg-card" : ""
                }`}
              >
                {children}
              </div>
            </div>
          )}

          {/* Connection Handles - 按照motia的逻辑 */}
          {!disableTargetHandle && (
            <Handle
              type="target"
              position={Position.Left}
              className="w-3 h-3 bg-accent-1000 border-2 border-background"
            />
          )}
          {!disableSourceHandle && (
            <Handle
              type="source"
              position={Position.Right}
              className="w-3 h-3 bg-accent-1000 border-2 border-background"
            />
          )}
        </div>
      </div>
    </div>
  );
}
