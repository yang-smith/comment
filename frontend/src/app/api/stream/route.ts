import { NextRequest, NextResponse } from 'next/server';

// 添加此行以支持Cloudflare Pages
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model = 'perplexity/r1-1776' } = body;
    
    // 获取 OpenRouter API 密钥
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: '未配置 OPENROUTER_API_KEY 环境变量' },
        { status: 500 }
      );
    }

    // 调用 OpenRouter API (非流式)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'Comment Analysis',
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

    // 解析 JSON 响应
    const data = await response.json();
    
    // 返回 JSON 响应
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API代理错误:', error);
    return NextResponse.json(
      { error: `处理请求时发生错误: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 