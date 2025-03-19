"use client"

import { useState } from "react"
import { Loader2, Share2, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

export default function CommentAnalyzer() {
  const [comments, setComments] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [parsedResults, setParsedResults] = useState<{
    summary: string
    representatives: Array<{
      id: number
      name: string
      avatar: string
      opinion: string
      percentage: number
    }>
  } | null>(null)

  const handleClear = () => {
    setComments("")
    setParsedResults(null)
  }

  const handleAnalyze = async () => {
    if (!comments.trim()) return

    setIsAnalyzing(true)
    setParsedResults(null)

    try {
      // 构建提示词，告诉AI我们期望的输出格式
      const prompt = `
      你的性格幽默，善于化用网络梗，常年上网。
分析以下评论内容，提取关键信息，按以下JSON格式返回：
{
  "summary": "一句话总结评论的整体情况",
  "representatives": [
    {
      "id": 1,
      "name": "代表类型名称（取个贴切幽默的名字）",
      "avatar": "代表类型的表情符号",
      "opinion": "该类型的代表性观点",
      "percentage": 35
    },
    ...更多代表(总计3-5个代表，百分比总和为100)
  ]
}

请确保返回的是有效的JSON格式，不要有其他非JSON内容。

评论内容:
${comments}
`;

      // 使用fetch调用API
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          model: 'perplexity/r1-1776' // 可以从UI中选择不同模型
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析JSON响应
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        // 从响应中提取JSON部分
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('无法从响应中解析JSON');
        
        const jsonData = JSON.parse(jsonMatch[0]);
        
        // 确保数据格式符合预期
        if (!jsonData.summary || !Array.isArray(jsonData.representatives)) {
          throw new Error('响应数据格式不符合预期');
        }
        
        // 设置解析后的结果
        setParsedResults(jsonData);
      } catch (jsonError) {
        console.error('解析JSON失败:', jsonError);
        alert('解析AI回复失败，请重试');
      }
    } catch (error) {
      console.error('分析评论出错:', error);
      alert('分析评论时出现错误，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 使用解析后的结果或模拟数据渲染UI
  const results = parsedResults;

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block relative mb-4">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              评论了个啥？
            </h1>
            <motion.div
              className="absolute -top-4 -right-8 text-2xl"
              animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-6 text-2xl"
              animate={{ rotate: [0, -10, 0], y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
            >
              🔍
            </motion.div>
          </div>
          <p className="text-muted-foreground text-lg">粘贴评论，一键解读精彩观点</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 border-2 border-pink-200 dark:border-pink-800 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <CardTitle>粘贴评论</CardTitle>
              </div>
              <CardDescription>将社交媒体评论复制粘贴到下方文本框</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="在此粘贴评论内容..."
                className="min-h-[200px] mb-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 focus-visible:ring-pink-400"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                  className="rounded-full border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  清空
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !comments.trim()}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI正在思考中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      分析评论
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                className="text-5xl"
              >
                🧠
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                className="absolute -top-4 -right-4 text-2xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 text-2xl"
              >
                ✨
              </motion.div>
            </div>
            <p className="mt-4 text-lg font-medium text-pink-500 dark:text-pink-400">AI正在分析评论中...</p>
            <p className="text-sm text-muted-foreground">正在寻找观点规律，请稍等片刻</p>
          </motion.div>
        )}

        {results && (
          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <div>
                      <CardTitle>评论人民代表制</CardTitle>
                      <CardDescription>代表性评论者的观点和态度</CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border-2 border-pink-200 dark:border-pink-800">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span className="text-xl">🔗</span>
                          分享结果
                        </DialogTitle>
                        <DialogDescription>选择以下方式分享分析结果</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-4 gap-4 py-4">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-4 rounded-xl border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                        >
                          <span className="text-2xl">📱</span>
                          <span>微信</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-4 rounded-xl border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                        >
                          <span className="text-2xl">🔴</span>
                          <span>微博</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-4 rounded-xl border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                        >
                          <span className="text-2xl">📋</span>
                          <span>复制链接</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-4 rounded-xl border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                        >
                          <span className="text-2xl">📷</span>
                          <span>截图</span>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {results.representatives.map((rep, index) => (
                      <motion.div
                        key={rep.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-14 w-14 text-3xl bg-gradient-to-br from-pink-200 to-blue-200 dark:from-pink-800 dark:to-blue-800 border-2 border-white dark:border-slate-700 shadow-md">
                              <AvatarFallback>{rep.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 text-xs font-bold border border-pink-200 dark:border-pink-800">
                              {rep.percentage}%
                            </div>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-lg flex items-center gap-1">
                                {rep.name}
                                {rep.percentage > 40 && <span className="text-sm">👑</span>}
                              </h3>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"
                                style={{ width: `${rep.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-sm border-l-4 border-pink-300 dark:border-pink-700 pl-3 py-1 italic">
                              {rep.opinion}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">💡</span>
                      <h3 className="font-medium">一句话总结</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <p className="text-lg font-medium">{results.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground mt-8 pb-16">
          <p>© 2025 评论了个啥？ 版权所有</p>
          <div className="flex justify-center gap-1 mt-1">
            <span>❤️</span>
            <span>🧠</span>
            <span>💬</span>
          </div>
        </div>
      </div>
    </main>
  )
}

