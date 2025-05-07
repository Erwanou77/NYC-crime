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
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Crimes violents</div>
            <div className="text-2xl font-bold">42%</div>
            <div className="text-xs text-muted-foreground">+5% par rapport à l'année dernière</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Crimes contre la propriété</div>
            <div className="text-2xl font-bold">58%</div>
            <div className="text-xs text-muted-foreground">-3% par rapport à l'année dernière</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
