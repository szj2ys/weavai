"use client";

import { useState } from "react";
import { FlowChart } from "@/components/FlowChart";
import { InputPanel } from "@/components/InputPanel";
import { Header } from "@/components/Header";
import { Panel, PanelHeader, PanelContent } from "@/components/Panel";
import { Loader2, GanttChart } from "lucide-react";

export default function Home() {
  const [flowData, setFlowData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlow = async (description: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("生成流程图失败");
      }

      const data = await response.json();
      setFlowData(data);
    } catch (error) {
      console.error("Error:", error);
      alert("生成流程图时出错，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] bg-background text-foreground h-screen">
      <Header />

      <main className="m-2 overflow-hidden" role="main">
        <div className="grid grid-cols-[400px_1fr] gap-2 h-full">
          {/* 左侧输入面板 */}
          <div className="flex flex-col gap-2">
            <InputPanel onGenerate={handleGenerateFlow} isLoading={isLoading} />
          </div>

          {/* 右侧流程图面板 */}
          <Panel className="flex flex-col">
            <PanelHeader>
              <div className="flex items-center gap-2">
                <GanttChart className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  流程图视图
                </h2>
              </div>
            </PanelHeader>

            <PanelContent className="flex-1 p-0 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
                    <p className="text-muted-foreground">
                      AI 正在生成流程图...
                    </p>
                  </div>
                </div>
              ) : flowData ? (
                <FlowChart data={flowData} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">🎨</div>
                    <p>在左侧输入流程描述，开始生成流程图</p>
                  </div>
                </div>
              )}
            </PanelContent>
          </Panel>
        </div>
      </main>
    </div>
  );
}
