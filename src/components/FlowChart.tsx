"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { Download, Maximize2 } from "lucide-react";
import { flowNodeTypes } from "./nodes/FlowNodeTypes";
import { SmartEdge, ConditionalEdge } from "./edges/SmartEdge";
import "@xyflow/react/dist/style.css";

interface FlowChartProps {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
}

export function FlowChart({ data }: FlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
    }
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const downloadImage = () => {
    alert("Export feature in development...");
  };

  const fitView = () => {
    // 这里可以添加适应视图的逻辑
  };

  // 边类型映射
  const edgeTypes = {
    default: SmartEdge,
    smart: SmartEdge,
    conditional: ConditionalEdge,
  };

  return (
    <div className="w-full h-full relative bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={flowNodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        className="bg-background [--xy-edge-stroke:var(--border)] [--xy-node-border:var(--border)]"
      >
        <Controls className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg shadow-sm" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={42}
          size={1.75}
          className="[--xy-background-color-dots:theme(colors.muted.DEFAULT)] [--xy-background-color:theme(colors.background)]"
        />
        <MiniMap
          className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg shadow-sm"
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor={(node) => {
            if (node.type === "input") return "var(--accent-1000)";
            if (node.type === "output") return "var(--error)";
            return "var(--accent-1000)";
          }}
        />
        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={fitView}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors shadow-sm"
            title="Fit view"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors shadow-sm"
            title="Export image"
          >
            <Download className="h-4 w-4" />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
