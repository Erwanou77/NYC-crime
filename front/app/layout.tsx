import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MonthSelectorProvider } from "@/contexts/month-selector-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NYC Crime Visualization Platform",
  description: "Analyse et visualisation des données criminelles de New York",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <MonthSelectorProvider>{children}</MonthSelectorProvider>
      </body>
    </html>
  )
}
