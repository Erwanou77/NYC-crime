"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  { name: "Vol", value: 28 },
  { name: "Agression", value: 22 },
  { name: "Cambriolage", value: 18 },
  { name: "Vol à main armée", value: 15 },
  { name: "Homicide", value: 5 },
  { name: "Autres", value: 12 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function CrimeStats() {
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={500}>
        <iframe title="camembert" src="https://app.powerbi.com/view?r=eyJrIjoiNjAxZjg5YmMtZWNjYS00MmQ4LTk2ZDgtNDJhN2I4NWZlZTBmIiwidCI6IjEwOGJjODY0LWNkZjUtNGVjMy04YjdjLTRlYjA2YmUxYjQxZCIsImMiOjl9" allowFullScreen={true}></iframe>
      </ResponsiveContainer>
    </div>
  )
}
