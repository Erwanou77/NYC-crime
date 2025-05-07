import type { Metadata } from "next"
import DashboardPage from "@/components/dashboard-page"

export const metadata: Metadata = {
  title: "NYC Crime Visualization Platform",
  description: "Analyse et visualisation des données criminelles de New York",
}

export default function Home() {
  return <DashboardPage />
}
