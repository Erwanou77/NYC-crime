"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Semaine 1", réel: 400, prédit: null },
  { name: "Semaine 2", réel: 380, prédit: null },
  { name: "Semaine 3", réel: 420, prédit: null },
  { name: "Semaine 4", réel: 450, prédit: null },
  { name: "Semaine 5", réel: 470, prédit: null },
  { name: "Semaine 6", réel: 440, prédit: null },
  { name: "Semaine 7", réel: 410, prédit: null },
  { name: "Semaine 8", réel: 390, prédit: null },
  { name: "Semaine 9", réel: 430, prédit: null },
  { name: "Semaine 10", réel: 460, prédit: null },
  { name: "Semaine 11", réel: 480, prédit: null },
  { name: "Semaine 12", réel: 500, prédit: null },
  { name: "Semaine 13", réel: null, prédit: 520 },
  { name: "Semaine 14", réel: null, prédit: 540 },
  { name: "Semaine 15", réel: null, prédit: 510 },
  { name: "Semaine 16", réel: null, prédit: 490 },
]

export default function CrimePrediction() {
  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="réel" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="prédit" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Précision du modèle</h3>
          <div className="mt-2 text-2xl font-bold">87%</div>
          <p className="text-sm text-muted-foreground">Basé sur les données historiques</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Tendance prévue</h3>
          <div className="mt-2 text-2xl font-bold text-amber-500">+8%</div>
          <p className="text-sm text-muted-foreground">Pour les 30 prochains jours</p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-medium">Zones à risque élevé prévues</h3>
        <ul className="mt-2 space-y-2">
          <li className="flex items-center justify-between">
            <span>Brooklyn - Quartier Bedford-Stuyvesant</span>
            <span className="font-medium text-red-500">Risque élevé</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Bronx - Quartier South Bronx</span>
            <span className="font-medium text-red-500">Risque élevé</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Manhattan - Quartier Harlem</span>
            <span className="font-medium text-amber-500">Risque moyen</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
