# Legal Translation Review System

专业的法律英语翻译审核系统，支持多模型协同翻译、智能审核和知识库增强。

## 功能特性

### 三阶段翻译工作流
- **阶段一：初始翻译** - 多个AI模型并行翻译
- **阶段二：审核评价** - 专业审核模型评判翻译质量并提供建议
- **阶段三：综合翻译** - 综合前两阶段结果，生成最优翻译

### 灵活的模型配置
- 支持自定义API端点、API Key、模型ID
- 可配置系统提示词、温度参数等
- 支持任意数量的模型组合
- 每个环节独立配置

### 知识库增强（RAG）
- 支持上传法律词典等参考文档
- 自定义嵌入模型
- 智能检索相关知识辅助翻译

### 简洁的用户界面
- 黑白色调，专业简约
- 对话式交互体验
- 实时查看各模型输出
- 直观的配置管理

## 项目结构

```
legal-translation-system/
├── frontend/              # Vue 3 前端应用
│   ├── src/
│   │   ├── components/   # UI组件
│   │   ├── views/        # 页面视图
│   │   ├── stores/       # 状态管理
│   │   ├── services/     # API服务
│   │   └── types/        # TypeScript类型
│   └── package.json
├── backend/              # Node.js 后端服务
│   ├── src/
│   │   ├── routes/       # API路由
│   │   ├── services/     # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   └── utils/        # 工具函数
│   └── package.json
└── README.md
```

## 快速开始

### 前置要求
- Node.js 18+
- pnpm（推荐）或 npm

### 安装依赖

```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

### 开发模式

```bash
# 启动后端服务（端口：3000）
cd backend
pnpm dev

# 启动前端服务（端口：5173）
cd frontend
pnpm dev
```

访问 http://localhost:5173 即可使用。

## 使用说明

### 1. 配置模型

在"模型配置"页面中：
- 添加翻译模型（阶段一）
- 添加审核模型（阶段二）
- 添加综合模型（阶段三）
- 配置嵌入模型（知识库）

每个模型可以配置：
- API 端点
- API Key
- 模型 ID
- 系统提示词
- 温度参数
- 其他自定义参数

### 2. 管理知识库

在"知识库"页面中：
- 上传法律词典、参考文档
- 支持格式：TXT, PDF, DOCX, MD
- 自动向量化并存储

### 3. 开始翻译

在主页面中：
- 输入法律英语文本
- 点击"开始翻译"
- 系统将自动执行三阶段工作流
- 实时查看各模型输出结果

## 技术架构

### 前端
- Vue 3 - 渐进式JavaScript框架
- TypeScript - 类型安全
- Vite - 快速构建工具
- Tailwind CSS - 实用优先的CSS框架
- Pinia - 状态管理
- Axios - HTTP客户端

### 后端
- Node.js - JavaScript运行时
- Express - Web框架
- TypeScript - 类型安全
- SQLite - 轻量级数据库
- Chroma - 向量数据库
- Multer - 文件上传

## 参考项目

- [ai-sdk-panel](https://github.com/MatrixAges/ai-sdk-panel) - AI提供商配置面板
- [ai-elements-vue](https://github.com/vuepont/ai-elements-vue) - AI场景Vue组件库

## License

MIT
