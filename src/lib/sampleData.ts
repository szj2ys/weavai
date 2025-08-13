export const sampleFlowData = {
  nodes: [
    {
      id: "1",
      type: "input",
      data: { label: "开始" },
      position: { x: 250, y: 0 },
    },
    {
      id: "2",
      data: { label: "用户输入信息" },
      position: { x: 250, y: 100 },
    },
    {
      id: "3",
      data: { label: "验证信息" },
      position: { x: 250, y: 200 },
    },
    {
      id: "4",
      data: { label: "信息有效？" },
      position: { x: 250, y: 300 },
    },
    {
      id: "5",
      data: { label: "显示错误信息" },
      position: { x: 100, y: 400 },
    },
    {
      id: "6",
      data: { label: "保存到数据库" },
      position: { x: 400, y: 400 },
    },
    {
      id: "7",
      type: "output",
      data: { label: "完成" },
      position: { x: 250, y: 500 },
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      label: "无效",
      animated: true,
    },
    {
      id: "e4-6",
      source: "4",
      target: "6",
      label: "有效",
      animated: true,
    },
    {
      id: "e5-2",
      source: "5",
      target: "2",
      animated: true,
    },
    {
      id: "e6-7",
      source: "6",
      target: "7",
      animated: true,
    },
  ],
};
