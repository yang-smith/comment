import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model = 'openai/gpt-4o' } = body;
    
    // 获取 OpenRouter API 密钥
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: '未配置 OPENROUTER_API_KEY 环境变量' },
        { status: 500 }
      );
    }

    // 调用 OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': '评论了个啥？',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        stream: true,
      }),
    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API 返回错误: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    // 直接返回流式响应
    return new NextResponse(response.body);
    
  } catch (error) {
    console.error('API代理错误:', error);
    return NextResponse.json(
      { error: `处理请求时发生错误: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 