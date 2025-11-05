# 配置示例

本文档提供了常见AI模型的配置示例。

## OpenAI 模型

### GPT-4（翻译模型）

```json
{
  "name": "GPT-4 法律翻译",
  "stage": "translation",
  "apiEndpoint": "https://api.openai.com/v1/chat/completions",
  "apiKey": "sk-...",
  "modelId": "gpt-4",
  "systemPrompt": "你是一位专业的法律翻译专家，精通法律英语和中文。请准确翻译法律文本，保持专业术语的准确性，确保译文流畅易懂。",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

### GPT-3.5 Turbo（审核模型）

```json
{
  "name": "GPT-3.5 审核",
  "stage": "review",
  "apiEndpoint": "https://api.openai.com/v1/chat/completions",
  "apiKey": "sk-...",
  "modelId": "gpt-3.5-turbo",
  "systemPrompt": "你是一位资深的法律翻译审核专家。请从准确性、专业性、流畅性等方面评价翻译质量，并提供具体的改进建议。请给出评分（1-10分）。",
  "temperature": 0.5,
  "maxTokens": 1500
}
```

### Text-Embedding-3-Small（嵌入模型）

```json
{
  "name": "OpenAI Embedding",
  "stage": "embedding",
  "apiEndpoint": "https://api.openai.com/v1/embeddings",
  "apiKey": "sk-...",
  "modelId": "text-embedding-3-small",
  "systemPrompt": ""
}
```

## Anthropic Claude 模型

### Claude 3 Opus（综合模型）

```json
{
  "name": "Claude 3 综合翻译",
  "stage": "synthesis",
  "apiEndpoint": "https://api.anthropic.com/v1/messages",
  "apiKey": "sk-ant-...",
  "modelId": "claude-3-opus-20240229",
  "systemPrompt": "你是一位经验丰富的法律翻译专家。请综合考虑所有翻译结果和审核意见，生成一个更准确、专业、流畅的最终译文。只输出译文，不需要额外解释。",
  "temperature": 0.4,
  "maxTokens": 2000
}
```

**注意**: Claude API 格式与 OpenAI 不同，可能需要使用兼容层或代理服务。

## 本地模型（Ollama）

### Qwen2.5（翻译模型）

```json
{
  "name": "Qwen2.5 本地翻译",
  "stage": "translation",
  "apiEndpoint": "http://localhost:11434/v1/chat/completions",
  "apiKey": "ollama",
  "modelId": "qwen2.5:14b",
  "systemPrompt": "你是专业的法律翻译专家，请将法律英语准确翻译成中文。",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

### Llama 3（审核模型）

```json
{
  "name": "Llama 3 本地审核",
  "stage": "review",
  "apiEndpoint": "http://localhost:11434/v1/chat/completions",
  "apiKey": "ollama",
  "modelId": "llama3:8b",
  "systemPrompt": "你是法律翻译审核专家。请评价翻译质量，给出1-10分评分和改进建议。",
  "temperature": 0.5,
  "maxTokens": 1500
}
```

### BGE 嵌入模型

```json
{
  "name": "BGE 本地嵌入",
  "stage": "embedding",
  "apiEndpoint": "http://localhost:11434/v1/embeddings",
  "apiKey": "ollama",
  "modelId": "bge-large",
  "systemPrompt": ""
}
```

## Google Gemini 模型

### Gemini Pro（翻译模型）

```json
{
  "name": "Gemini Pro 翻译",
  "stage": "translation",
  "apiEndpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  "apiKey": "your-api-key",
  "modelId": "gemini-pro",
  "systemPrompt": "你是专业的法律翻译专家，请准确翻译法律英语文本。",
  "temperature": 0.3
}
```

**注意**: Gemini API 格式不同，可能需要额外的适配。

## DeepSeek 模型

### DeepSeek Chat（翻译模型）

```json
{
  "name": "DeepSeek 翻译",
  "stage": "translation",
  "apiEndpoint": "https://api.deepseek.com/v1/chat/completions",
  "apiKey": "sk-...",
  "modelId": "deepseek-chat",
  "systemPrompt": "你是专业的法律翻译专家，精通中英法律术语。",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

## 系统提示词模板

### 翻译模型提示词

#### 基础版
```
你是一位专业的法律翻译专家，精通法律英语和中文。
请准确翻译法律文本，保持专业术语的准确性，确保译文流畅易懂。
```

#### 详细版
```
你是一位经验丰富的法律翻译专家，具有以下特点：

专业背景：
- 精通法律英语和中文
- 熟悉普通法和大陆法系术语
- 了解国际商法、合同法、知识产权法等领域

翻译原则：
1. 准确性：准确传达法律术语的含义，不得擅自增删
2. 专业性：使用恰当的法律术语和表达方式
3. 流畅性：确保译文通顺，符合中文表达习惯
4. 一致性：同一术语在全文保持一致的翻译

特殊处理：
- 对于没有对应中文术语的概念，可保留英文并加注释
- 合同条款的序号结构保持不变
- 日期、金额等按照中文习惯格式化

请翻译以下法律英语文本：
```

### 审核模型提示词

#### 基础版
```
你是一位资深的法律翻译审核专家。
请从准确性、专业性、流畅性等方面评价翻译质量，
并提供具体的改进建议。
```

#### 详细版
```
你是一位资深的法律翻译审核专家，请按照以下标准评价翻译质量：

评价维度：

1. 准确性（权重40%）
   - 是否准确表达了原文的法律含义
   - 有无误译、漏译或过度翻译
   - 法律术语使用是否准确

2. 专业性（权重30%）
   - 是否使用了恰当的法律术语
   - 表达是否符合法律文件规范
   - 术语翻译是否统一一致

3. 流畅性（权重20%）
   - 译文是否通顺易懂
   - 是否符合中文表达习惯
   - 语序和句式是否合理

4. 完整性（权重10%）
   - 是否有内容遗漏
   - 结构是否完整
   - 格式是否正确

评价格式：
- 总评分：X/10分
- 各维度评分和说明
- 具体的改进建议（至少3条）
- 优秀之处（如有）

请评价以下翻译：
```

### 综合模型提示词

#### 基础版
```
你是一位经验丰富的法律翻译专家。
请综合考虑所有翻译结果和审核意见，
生成一个更准确、专业、流畅的最终译文。
只输出译文，不需要额外解释。
```

#### 详细版
```
你是一位高级法律翻译专家，现在需要完成最终译文的综合优化。

任务说明：
1. 你将看到多个AI模型的翻译结果
2. 你将看到审核专家的评价和建议
3. 请综合所有信息，生成最优译文

综合原则：
1. 吸收各译文的优点
2. 采纳有价值的审核建议
3. 确保最终译文的准确性、专业性和流畅性
4. 保持译文风格统一

输出要求：
- 只输出最终的中文译文
- 不要包含任何解释、说明或评论
- 保持原文的格式和结构
- 确保译文完整

现在，请基于以下信息生成最终译文：
```

## 多模型配置策略

### 策略一：性价比方案
- **翻译模型**: GPT-3.5-turbo x 2
- **审核模型**: GPT-3.5-turbo x 1
- **综合模型**: GPT-4 x 1
- **嵌入模型**: text-embedding-3-small

### 策略二：高质量方案
- **翻译模型**: GPT-4 x 2, Claude-3-Opus x 1
- **审核模型**: GPT-4 x 1, Claude-3-Sonnet x 1
- **综合模型**: GPT-4 x 1
- **嵌入模型**: text-embedding-3-large

### 策略三：本地化方案
- **翻译模型**: Qwen2.5:14b x 2, Llama3:8b x 1
- **审核模型**: Qwen2.5:7b x 1
- **综合模型**: Qwen2.5:14b x 1
- **嵌入模型**: bge-large

### 策略四：混合方案
- **翻译模型**: GPT-4 x 1, Qwen2.5 x 1, Claude-3 x 1
- **审核模型**: GPT-3.5-turbo x 1
- **综合模型**: GPT-4 x 1
- **嵌入模型**: text-embedding-3-small

## 温度参数建议

- **翻译模型**: 0.2-0.4（低温度，追求准确性）
- **审核模型**: 0.4-0.6（中等温度，保持评价客观性）
- **综合模型**: 0.3-0.5（中低温度，平衡准确性和创造性）
- **嵌入模型**: 通常不需要设置温度

## 其他参数建议

### maxTokens
- **翻译模型**: 2000-4000（根据文本长度）
- **审核模型**: 1000-2000
- **综合模型**: 2000-4000

### topP
- **翻译任务**: 0.9-0.95
- **审核任务**: 0.9-1.0

### frequencyPenalty / presencePenalty
- 通常保持默认值（0）
- 如果输出重复，可适当增加到 0.1-0.3
