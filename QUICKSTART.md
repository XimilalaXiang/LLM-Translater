# 快速开始指南

## 一键启动（推荐）

### Linux / Mac
```bash
./start.sh
```

### Windows
```bash
start.bat
```

启动脚本会自动：
1. 检查 Node.js 环境
2. 安装依赖（如果需要）
3. 创建配置文件
4. 启动后端和前端服务

启动后访问：http://localhost:5173

## 手动启动

### 1. 安装依赖

```bash
# 后端
cd backend
npm install  # 或 pnpm install

# 前端
cd ../frontend
npm install  # 或 pnpm install
```

### 2. 配置环境

```bash
cd backend
cp .env.example .env
# 根据需要编辑 .env 文件
```

### 3. 启动服务

**终端 1 - 后端：**
```bash
cd backend
npm run dev
```

**终端 2 - 前端：**
```bash
cd frontend
npm run dev
```

## 首次使用配置

### 步骤 1：添加翻译模型

1. 访问 http://localhost:5173
2. 点击顶部导航栏的"模型配置"
3. 点击"添加模型"按钮
4. 填写模型信息：

**示例配置（OpenAI GPT-4）：**
```
名称: GPT-4 翻译
阶段: 翻译模型
API端点: https://api.openai.com/v1/chat/completions
API Key: sk-your-api-key-here
模型ID: gpt-4
系统提示词: 你是一位专业的法律翻译专家，精通法律英语和中文。
温度: 0.3
```

5. 点击"测试"确保连接正常
6. 确保模型状态为"已启用"

### 步骤 2：（可选）添加更多模型

为了获得更好的效果，建议配置：
- **2-3个翻译模型**（不同的AI提供商，如OpenAI、Claude、Gemini）
- **1-2个审核模型**
- **1-2个综合模型**
- **1个嵌入模型**（如果需要使用知识库）

### 步骤 3：开始翻译

1. 返回主页
2. 在输入框中输入法律英语文本
3. 点击"开始翻译"
4. 等待系统完成三阶段处理
5. 查看结果

## 支持的AI提供商

### OpenAI
```
API端点: https://api.openai.com/v1/chat/completions
模型: gpt-4, gpt-3.5-turbo
```

### Anthropic Claude
```
API端点: https://api.anthropic.com/v1/messages
模型: claude-3-opus-20240229, claude-3-sonnet-20240229
注意: 需要调整API格式，或使用兼容的代理
```

### Google Gemini
```
API端点: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
模型: gemini-pro
注意: 需要使用API key参数，可能需要调整请求格式
```

### 本地模型（Ollama）
```
API端点: http://localhost:11434/v1/chat/completions
模型: llama2, mistral, qwen等
```

### 其他兼容OpenAI格式的API
- LocalAI
- vLLM
- FastChat
- Text Generation WebUI（使用OpenAI扩展）
- 各种代理服务

## 常见问题

### Q: 启动后端时报错 "Address already in use"
A: 端口 3000 被占用。修改 `backend/.env` 中的 `PORT` 配置。

### Q: 前端无法连接后端
A: 确保：
1. 后端正在运行（http://localhost:3000/api/health 应该返回正常）
2. 检查 `frontend/vite.config.ts` 中的代理配置
3. 检查防火墙设置

### Q: 模型测试失败
A: 检查：
1. API Key 是否正确
2. API 端点是否正确
3. 网络连接是否正常
4. API 提供商是否有使用限制

### Q: 知识库上传失败
A: 确保：
1. 已配置嵌入模型
2. 文件格式正确（TXT/PDF/DOCX/MD）
3. 文件大小不超过 10MB
4. 有足够的磁盘空间

### Q: 翻译一直没有响应
A: 可能原因：
1. API 响应慢或超时
2. 配置了太多模型
3. 检查浏览器控制台和后端日志

## 下一步

- 查看 [USAGE.md](./USAGE.md) 了解详细使用说明
- 查看 [README.md](./README.md) 了解技术架构
- 优化系统提示词以获得更好的翻译效果
- 上传法律词典到知识库

## 获取帮助

遇到问题？
- 查看 [GitHub Issues](https://github.com/XimilalaXiang/LLM-Translater/issues)
- 阅读完整文档
- 检查浏览器控制台和后端日志
