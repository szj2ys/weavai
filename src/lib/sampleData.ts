export const sampleFlowData = {
  nodes: [
    {
      id: "1",
      type: "input",
      data: { label: "Start" },
      position: { x: 250, y: 0 },
    },
    {
      id: "2",
      data: { label: "User Input Information" },
      position: { x: 250, y: 100 },
    },
    {
      id: "3",
      data: { label: "Validate Information" },
      position: { x: 250, y: 200 },
    },
    {
      id: "4",
      data: { label: "Is Information Valid?" },
      position: { x: 250, y: 300 },
    },
    {
      id: "5",
      data: { label: "Show Error Message" },
      position: { x: 100, y: 400 },
    },
    {
      id: "6",
      data: { label: "Save to Database" },
      position: { x: 400, y: 400 },
    },
    {
      id: "7",
      type: "output",
      data: { label: "Complete" },
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
      label: "Invalid",
      animated: true,
    },
    {
      id: "e4-6",
      source: "4",
      target: "6",
      label: "Valid",
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
