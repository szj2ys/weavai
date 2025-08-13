"use client";

import { Handle, Position } from "@xyflow/react";
import {
  Play,
  Square,
  Diamond,
  FileInput,
  FileOutput,
  Circle,
  FileText,
  Database,
  StopCircle,
  User,
  ShieldCheck,
  Save,
  Send,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  FlaskConical,
  UploadCloud,
  Bell,
  Mail,
  Search,
  Lock,
  Bug,
  Cloud,
  Globe,
  Cog,
  CheckCircle2,
} from "lucide-react";
import { NodeType } from "@/types/flowchart";

interface FlowNodeProps {
  data: {
    id: string;
    type: NodeType;
    label: string;
    description?: string;
    conditions?: Array<{
      id: string;
      label: string;
      value: string | boolean;
    }>;
  };
}

// 基于内容智能选择图标（优先于类型）
const getContentIcon = (label?: string, description?: string) => {
  const text = `${label || ""} ${description || ""}`;
  const has = (kw: string | RegExp) =>
    typeof kw === "string"
      ? text.toLowerCase().includes(kw.toLowerCase())
      : kw.test(text);

  if (has(/注册|登录|用户|账号/)) return <User className="w-4 h-4" />;
  if (has(/验证|校验|认证|权限|安全/)) return <ShieldCheck className="w-4 h-4" />;
  if (has(/保存|入库|持久化/)) return <Save className="w-4 h-4" />;
  if (has(/数据库|DB|存储/)) return <Database className="w-4 h-4" />;
  if (has(/输入|填写/)) return <FileInput className="w-4 h-4" />;
  if (has(/输出|返回|响应/)) return <FileOutput className="w-4 h-4" />;
  if (has(/文档|报告|说明/)) return <FileText className="w-4 h-4" />;
  if (has(/通知|消息|发送/)) return <Send className="w-4 h-4" />;
  if (has(/聊天|对话|沟通/)) return <MessageSquare className="w-4 h-4" />;
  if (has(/订单|购物|商品/)) return <ShoppingCart className="w-4 h-4" />;
  if (has(/支付|结算|账单/)) return <CreditCard className="w-4 h-4" />;
  if (has(/测试|校验/)) return <FlaskConical className="w-4 h-4" />;
  if (has(/部署|上线|发布/)) return <UploadCloud className="w-4 h-4" />;
  if (has(/告警|报警/)) return <Bell className="w-4 h-4" />;
  if (has(/邮件|邮箱/)) return <Mail className="w-4 h-4" />;
  if (has(/搜索|检索/)) return <Search className="w-4 h-4" />;
  if (has(/加密|密钥|权限/)) return <Lock className="w-4 h-4" />;
  if (has(/异常|错误|bug/i)) return <Bug className="w-4 h-4" />;
  if (has(/云|服务|API|接口/)) return <Cloud className="w-4 h-4" />;
  if (has(/全球|国际化|网络/)) return <Globe className="w-4 h-4" />;
  if (has(/配置|设置/)) return <Cog className="w-4 h-4" />;
  if (has(/完成|成功/)) return <CheckCircle2 className="w-4 h-4" />;
  return null;
};

// 获取节点图标：优先内容，其次类型
const getNodeIcon = (type: NodeType, label?: string, description?: string) => {
  const byContent = getContentIcon(label, description);
  if (byContent) return byContent;
  switch (type) {
    case "start":
      return <Play className="w-4 h-4" />;
    case "end":
      return <StopCircle className="w-4 h-4" />;
    case "process":
      return <Square className="w-4 h-4" />;
    case "decision":
      return <Diamond className="w-3 h-3" />;
    case "input":
      return <FileInput className="w-4 h-4" />;
    case "output":
      return <FileOutput className="w-4 h-4" />;
    case "connector":
      return <Circle className="w-4 h-4" />;
    case "document":
      return <FileText className="w-4 h-4" />;
    case "database":
      return <Database className="w-4 h-4" />;
    default:
      return <Square className="w-4 h-4" />;
  }
};

// 获取节点的连接点配置
const getHandleConfig = (type: NodeType) => {
  switch (type) {
    case "start":
      return { target: false, source: true };
    case "end":
      return { target: true, source: false };
    case "decision":
      return { target: true, source: true, multipleSource: true };
    default:
      return { target: true, source: true };
  }
};

// 决策节点组件 - 重新设计连接点位置
function DecisionNode({ data }: { data: FlowNodeProps["data"] }) {
  const conditions =
    (Array.isArray(data.conditions) && data.conditions.length > 0
      ? data.conditions
      : [
          { id: "yes", label: "是", value: true },
          { id: "no", label: "否", value: false },
        ]) as Array<{ id: string; label: string; value: string | boolean }>;

  // 为前3个条件分配固定方位，超出则统一放在顶部（避免重复过多复杂布局）
  const handleSlots = [Position.Right, Position.Bottom, Position.Left, Position.Top];

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* 输入连接点 - 菱形顶部外侧 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
        style={{
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* 菱形节点主体 */}
      <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 transform rotate-45 flex items-center justify-center relative shadow-lg ring-1 ring-amber-600/40">
        <div className="transform -rotate-45 text-white text-xs font-semibold text-center px-1">
          <div className="flex flex-col items-center gap-1">
            {getNodeIcon(data.type, data.label, data.description)}
            <span className="leading-tight max-w-[70px] break-words text-center">
              {data.label}
            </span>
          </div>
        </div>
        {/* 小菱形角标 */}
        <div className="absolute -top-2 -left-2 w-5 h-5 bg-amber-600/90 text-white rounded-sm flex items-center justify-center shadow-sm">
          <Diamond className="w-3 h-3" />
        </div>
      </div>

      {/* 条件输出连接点（动态渲染） */}
      {conditions.slice(0, 4).map((cond, index) => {
        const position = handleSlots[index] ?? Position.Top;
        const baseProps = {
          type: "source" as const,
          id: cond.id,
          className:
            "w-3 h-3 border-2 border-background absolute rounded",
        };
        const style: React.CSSProperties = {};
        if (position === Position.Right) {
          style.right = "-6px";
          style.top = "50%";
          style.transform = "translateY(-50%)";
          baseProps.className += " bg-emerald-500";
        } else if (position === Position.Bottom) {
          style.bottom = "-6px";
          style.left = "50%";
          style.transform = "translateX(-50%)";
          baseProps.className += " bg-rose-500";
        } else if (position === Position.Left) {
          style.left = "-6px";
          style.top = "50%";
          style.transform = "translateY(-50%)";
          baseProps.className += " bg-sky-500";
        } else {
          style.top = "-6px";
          style.left = "50%";
          style.transform = "translateX(-50%)";
          baseProps.className += " bg-amber-500";
        }

        return (
          <Handle key={cond.id} position={position} style={style} {...baseProps} />
        );
      })}

      {/* 描述悬浮提示 */}
      {data.description && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg border border-border">
          {data.description}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t border-border"></div>
        </div>
      )}
    </div>
  );
}

// 平行四边形节点组件（输入/输出）
function ParallelogramNode({
  data,
  isInput,
}: {
  data: FlowNodeProps["data"];
  isInput: boolean;
}) {
  return (
    <div className="relative">
      {/* 输入连接点 */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
          style={{ top: "-6px", left: "50%", transform: "translateX(-50%)" }}
        />
      )}

      {/* 平行四边形节点 */}
      <div className="relative">
        <div
          className="bg-gradient-to-br from-violet-500 to-violet-600 text-white font-medium text-sm px-4 py-3 min-w-[140px] min-h-[52px] flex items-center justify-center relative shadow-lg ring-1 ring-violet-700/40"
          style={{
            clipPath: isInput
              ? "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)"
              : "polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            {getNodeIcon(data.type, data.label, data.description)}
            <span>{data.label}</span>
          </div>
        </div>
      </div>

      {/* 输出连接点 */}
      {isInput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
          style={{ bottom: "-6px", left: "50%", transform: "translateX(-50%)" }}
        />
      )}

      {/* 描述悬浮 */}
      {data.description && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg border border-border">
          {data.description}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t border-border"></div>
        </div>
      )}
    </div>
  );
}

// 普通节点组件
function RegularNode({
  data,
  bgColor,
  borderColor,
  shape,
}: {
  data: FlowNodeProps["data"];
  bgColor: string;
  borderColor: string;
  shape: "rounded-full" | "rounded-lg" | "rounded-t-lg";
}) {
  const handleConfig = getHandleConfig(data.type);
  const icon = getNodeIcon(data.type, data.label, data.description);

  return (
    <div className="relative">
      {/* 输入连接点 */}
      {handleConfig.target && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
          style={{ top: "-6px", left: "50%", transform: "translateX(-50%)" }}
        />
      )}

      {/* 节点主体 */}
      <div
        className={`bg-gradient-to-br ${bgColor} ${borderColor} text-white font-medium text-sm px-4 py-3 min-w-[140px] min-h-[52px] flex items-center justify-center ${shape} shadow-lg ring-1 ring-white/10`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{data.label}</span>
        </div>
      </div>

      {/* 输出连接点 */}
      {handleConfig.source && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
          style={{ bottom: "-6px", left: "50%", transform: "translateX(-50%)" }}
        />
      )}

      {/* 描述悬浮 */}
      {data.description && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg border border-border">
          {data.description}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t border-border"></div>
        </div>
      )}
    </div>
  );
}

export function FlowNode({ data }: FlowNodeProps) {
  // 决策节点特殊处理
  if (data.type === "decision") {
    return <DecisionNode data={data} />;
  }

  // 输入/输出节点特殊处理
  if (data.type === "input") {
    return <ParallelogramNode data={data} isInput={true} />;
  }
  if (data.type === "output") {
    return <ParallelogramNode data={data} isInput={false} />;
  }

  // 其他节点类型
  switch (data.type) {
    case "start":
      return (
        <RegularNode
          data={data}
          bgColor="from-emerald-500 to-emerald-600"
          borderColor="border-emerald-700/40"
          shape="rounded-full"
        />
      );
    case "end":
      return (
        <RegularNode
          data={data}
          bgColor="from-rose-500 to-rose-600"
          borderColor="border-rose-700/40"
          shape="rounded-full"
        />
      );
    case "process":
      return (
        <RegularNode
          data={data}
          bgColor="from-sky-500 to-sky-600"
          borderColor="border-sky-700/40"
          shape="rounded-lg"
        />
      );
    case "document":
      return (
        <RegularNode
          data={data}
          bgColor="from-amber-500 to-amber-600"
          borderColor="border-amber-700/40"
          shape="rounded-t-lg"
        />
      );
    case "database":
      return (
        <RegularNode
          data={data}
          bgColor="from-indigo-500 to-indigo-600"
          borderColor="border-indigo-700/40"
          shape="rounded-lg"
        />
      );
    case "connector":
      return (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
            style={{ top: "-6px", left: "50%", transform: "translateX(-50%)" }}
          />
          <div className="w-10 h-10 bg-gradient-to-br from-zinc-500 to-zinc-600 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/10">
            <Circle className="w-4 h-4 text-white" />
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-accent-1000 border-2 border-background absolute rounded"
            style={{
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      );
    default:
      return (
        <RegularNode
          data={data}
          bgColor="from-zinc-500 to-zinc-600"
          borderColor="border-zinc-700/40"
          shape="rounded-lg"
        />
      );
  }
}
