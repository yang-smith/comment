
import type React from "react"
import { Noto_Sans_SC } from "next/font/google"
import "./globals.css"
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata = {
  title: "评论了个啥？- 评论内容解析工具",
  description: "粘贴评论，一键解读精彩观点",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={notoSansSC.className}>
        {children}
      </body>
    </html>
  )
}

