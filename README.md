# AI 流程图生成器

一个基于 Next.js 和 AI 的智能流程图生成网站，参考 Motia 架构设计。

## 功能特性

- 🤖 **AI 驱动**: 使用 AI 模型根据文字描述自动生成流程图
- 🎨 **可视化**: 基于 React Flow 的交互式流程图展示
- 📱 **响应式**: 适配桌面和移动设备
- ⚡ **实时生成**: 快速响应，实时生成流程图
- 🛠 **容错处理**: 当 AI 调用失败时提供备用流程图

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Lucide React
- **流程图**: @xyflow/react (React Flow)
- **AI**: OpenAI SDK (兼容 ModelScope API)
- **包管理**: pnpm

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件并配置 AI API：

```env
OPENAI_BASE_URL="https://api-inference.modelscope.cn/v1"
OPENAI_API_KEY="your-api-key"
OPENAI_MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
OPENAI_TEMPERATURE="0"
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 使用方法

1. 在左侧输入面板中描述你想要生成的流程
2. 点击"生成流程图"按钮
3. AI 将分析你的描述并生成可视化流程图
4. 你可以在右侧查看和交互生成的流程图

### 示例描述

- "用户注册和登录流程"
- "电商订单处理流程"
- "软件开发生命周期"
- "客户服务处理流程"
- "数据备份和恢复流程"

## 项目结构

```
src/
├── app/
│   ├── api/generate-flow/     # AI 流程图生成 API
│   ├── globals.css           # 全局样式
│   └── page.tsx             # 主页面
├── components/
│   ├── FlowChart.tsx        # 流程图组件
│   └── InputPanel.tsx       # 输入面板组件
└── lib/
    └── flowUtils.ts         # 流程图工具函数
```

## API 接口

### POST /api/generate-flow

生成流程图数据

**请求体:**

```json
{
  "description": "流程描述文字"
}
```

**响应:**

```json
{
  "nodes": [...],
  "edges": [...]
}
```

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台

项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台。

## 开发说明

### 添加新的流程图类型

在 `src/lib/flowUtils.ts` 中的 `extractStepsFromDescription` 函数中添加新的流程识别逻辑。

### 自定义节点样式

在 `src/app/globals.css` 中修改 React Flow 节点样式。

### 扩展 AI 提示词

在 `src/app/api/generate-flow/route.ts` 中修改 `prompt` 变量来优化 AI 生成效果。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
